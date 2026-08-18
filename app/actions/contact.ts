"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { recordAuditLog } from "@/lib/audit";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { SubmissionType } from "@/lib/generated/prisma/enums";

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
  const forwarded = headerList.get("x-forwarded-for");
  const ipAddress =
    forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
  const userAgent = headerList.get("user-agent") ?? undefined;

  const limit = await checkRateLimit(`contact:${ipAddress}`);
  if (!limit.success) {
    return {
      status: "error",
      message: "Too many submissions from this connection. Try again shortly.",
    };
  }

  if (!isDatabaseConfigured()) {
    // Pre-credentials: do not pretend the message was stored.
    return {
      status: "error",
      message:
        "The form is not connected to a database yet. Please email hello@genesismedia.co in the meantime.",
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
    // Never surface database internals to a public form.
    return {
      status: "error",
      message: "Something went wrong saving that. Please try again.",
    };
  }
}
