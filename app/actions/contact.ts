"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { recordAuditLog } from "@/lib/audit";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import {
  COLUMN_FIELDS,
  FORMS,
  schemaFor,
  type FormKind,
} from "@/lib/forms";
import { SubmissionType } from "@/lib/generated/prisma/enums";
import { appendSubmission, isSheetsConfigured } from "@/lib/google-sheets";

/**
 * Contact / waitlist submission.
 *
 * Every public write goes through here, and it does four things in order:
 * validate with Zod, rate limit by IP, persist, then audit. Nothing touches
 * the database before validation passes.
 */

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.email("Please enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  type: z.enum(["CONTACT", "CREATOR", "CAREERS_WAITLIST"]),
  source: z.string().trim().max(120).optional(),
  /**
   * Honeypot. Real users never see this field, so anything in it is a bot.
   * Cheap, and it costs legitimate users nothing.
   */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SubmissionState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level errors, keyed by field name. */
  fieldErrors?: Record<string, string>;
};

export async function submitContactForm(
  _previous: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  const parsed = submissionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    message: formData.get("message") ?? "",
    type: formData.get("type"),
    source: formData.get("source") ?? undefined,
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Silently accept honeypot hits: telling a bot it failed only helps it.
  if (data.website) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const headerList = await headers();
  // Platform-set headers only — see clientIp(). This action had its own copy
  // of the lookup that trusted x-forwarded-for, so the rate limit below could
  // be reset at will by anyone willing to send a header.
  const ipAddress = clientIp(headerList);
  const userAgent = headerList.get("user-agent") ?? undefined;

  const limit = await checkRateLimit(`contact:${ipAddress}`);
  if (!limit.success) {
    return {
      status: "error",
      message: "Too many submissions from this connection. Try again shortly.",
    };
  }

  /*
    EITHER SINK WILL DO. Genesis asked for the form's backend to be a Google
    Sheet, and a sheet is where the people who act on an enquiry actually
    work — so a submission no longer depends on the database existing. It
    still goes to both when both are configured; what changed is that the
    form stops refusing the visitor when only one is.

    If NEITHER is configured it must still refuse, and say so honestly rather
    than accepting a message into nothing.
  */
  if (!isDatabaseConfigured() && !isSheetsConfigured()) {
    return {
      status: "error",
      message:
        "The form is not connected yet. Please email hello@genesismedia.co in the meantime.",
    };
  }

  /*
    The sheet is written FIRST and its result kept, because it is the copy a
    human will read. It never throws — see appendSubmission — so a Sheets
    outage cannot cost the database write below.
  */
  const sheeted = await appendSubmission({
    type: data.type,
    name: data.name,
    email: data.email,
    company: data.company,
    message: data.message,
    source: data.source,
  });

  if (!isDatabaseConfigured()) {
    return sheeted
      ? {
          status: "success",
          message:
            data.type === "CAREERS_WAITLIST"
              ? "You're on the list. We'll be in touch when a matching role opens."
              : "Thanks — we'll be in touch shortly.",
        }
      : {
          status: "error",
          message: "Something went wrong saving that. Please try again.",
        };
  }

  try {
    const record = await getPrisma().contactSubmission.create({
      data: {
        type: data.type as SubmissionType,
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message || null,
        source: data.source ?? null,
        ipAddress,
        userAgent: userAgent ?? null,
      },
      select: { id: true },
    });

    await recordAuditLog({
      action: "contact.submitted",
      entity: "contact_submission",
      entityId: record.id,
      metadata: { type: data.type, source: data.source },
      ipAddress,
      userAgent,
    });

    return {
      status: "success",
      message:
        data.type === "CAREERS_WAITLIST"
          ? "You're on the list. We'll be in touch when a matching role opens."
          : "Thanks — we'll be in touch shortly.",
    };
  } catch {
    /*
      The database write failed. If the sheet took it, the enquiry is not lost
      and the visitor should not be told to send it again — telling someone to
      retry a message that arrived is how you get two of them. Never surface
      database internals to a public form either way.
    */
    return sheeted
      ? { status: "success", message: "Thanks — we'll be in touch shortly." }
      : {
          status: "error",
          message: "Something went wrong saving that. Please try again.",
        };
  }
}

/**
 * The three lead forms — creator, brand, and the quick popup.
 *
 * One action for all of them, driven by the spec in lib/forms.ts: the `kind`
 * arrives in the payload, picks the spec, and the validator is derived from
 * that spec's own field list. A field cannot exist in the UI and be missing
 * from validation, because there is only one list.
 *
 * The order is the same as the original contact action and for the same
 * reasons: validate, reject bots, rate limit, persist, audit. Nothing touches
 * the database before validation passes.
 */
export async function submitGenesisForm(
  _previous: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  const kind = String(formData.get("kind") ?? "");
  if (!isFormKind(kind)) {
    return { status: "error", message: "Unknown form." };
  }

  const spec = FORMS[kind];
  const raw: Record<string, unknown> = {};
  for (const field of spec.fields) raw[field.name] = formData.get(field.name) ?? "";
  raw.hp = formData.get("hp") ?? "";
  raw.source = formData.get("source") ?? "";

  const parsed = schemaFor(spec).safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data as Record<string, string | undefined>;

  // Silently accept honeypot hits: telling a bot it failed only helps it.
  if (data.hp) {
    return { status: "success", message: spec.successMessage };
  }

  const headerList = await headers();
  const ipAddress = clientIp(headerList);
  const userAgent = headerList.get("user-agent") ?? undefined;

  const limit = await checkRateLimit(`form:${kind}:${ipAddress}`);
  if (!limit.success) {
    return {
      status: "error",
      message: "Too many submissions from this connection. Try again shortly.",
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message:
        "The form is not connected to a database yet. Please email hello@genesismedia.co in the meantime.",
    };
  }

  /*
    Split the answers: four of them are columns, the rest ride in the JSON
    `metadata` column that already exists on this model. Empty strings are
    dropped rather than stored, so a creator who skipped YouTube has no
    youtube key at all instead of an empty one.
  */
  const metadata: Record<string, string> = { kind };
  for (const field of spec.fields) {
    if (COLUMN_FIELDS.has(field.name)) continue;
    const value = data[field.name];
    if (value) metadata[field.name] = value;
  }

  // Same two-sink rule as the contact action above.
  if (!isDatabaseConfigured() && !isSheetsConfigured()) {
    return {
      status: "error",
      message:
        "The form is not connected yet. Please email hello@genesismedia.co in the meantime.",
    };
  }

  const sheeted = await appendSubmission({
    type: spec.submissionType,
    name: data.name!,
    email: data.email!,
    company: data.company,
    phone: data.phone,
    message: data.message,
    source: data.source,
  });

  if (!isDatabaseConfigured()) {
    return sheeted
      ? { status: "success", message: spec.successMessage }
      : {
          status: "error",
          message: "Something went wrong saving that. Please try again.",
        };
  }

  try {
    const record = await getPrisma().contactSubmission.create({
      data: {
        type: spec.submissionType as SubmissionType,
        name: data.name!,
        email: data.email!,
        company: data.company || null,
        message: data.message || null,
        source: data.source || null,
        metadata,
        ipAddress,
        userAgent: userAgent ?? null,
      },
      select: { id: true },
    });

    await recordAuditLog({
      action: "contact.submitted",
      entity: "contact_submission",
      entityId: record.id,
      metadata: { kind, source: data.source },
      ipAddress,
      userAgent,
    });

    return { status: "success", message: spec.successMessage };
  } catch {
    // See the note in the contact action: a sheeted lead is not a lost one.
    return sheeted
      ? { status: "success", message: spec.successMessage }
      : {
          status: "error",
          message: "Something went wrong saving that. Please try again.",
        };
  }
}

function isFormKind(value: string): value is FormKind {
  return value === "creator" || value === "brand" || value === "quick";
}
