import { z } from "zod";

/**
 * The three lead forms, defined once as data.
 *
 * WHY A SPEC AND NOT THREE COMPONENTS. Genesis needs a creator form, a brand
 * form and a small popup, and they are the same machine at three lengths:
 * same validation, same rate limit, same table, same honeypot, same error
 * rendering. Written as three components they drift within a fortnight — one
 * grows a field the others do not, one loses its error styling in a refactor.
 *
 * WHY THE ZOD SCHEMA IS DERIVED FROM THE SPEC RATHER THAN WRITTEN BESIDE IT.
 * A field list and a validator that must agree, maintained separately, is the
 * oldest bug in form code: someone adds a field to the UI and the server
 * silently drops it, or tightens the server and the UI never says why. There
 * is one list here, and the schema is built from it, so they cannot disagree.
 *
 * WHERE THE ANSWERS GO. `name`, `email`, `company` and `message` are columns
 * on contact_submissions. Everything else — a creator's follower count, a
 * brand's budget range — goes into the `metadata` JSON column that already
 * exists on that model. No migration, and nothing is thrown away.
 */

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea" | "select";
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  autoComplete?: string;
  /** Sits in one column of the two-column grid rather than spanning it. */
  half?: boolean;
  max?: number;
};

export type FormSpec = {
  kind: FormKind;
  /** Which SubmissionType the row is stored as. */
  submissionType: "CONTACT" | "CREATOR" | "CAREERS_WAITLIST";
  title: string;
  blurb: string;
  submitLabel: string;
  successMessage: string;
  fields: readonly FieldSpec[];
};

export type FormKind = "creator" | "brand" | "quick";

/** The four verticals plus the two honest answers a prospect might give. */
const NEEDS = [
  "Genesis Influence",
  "Genesis Studios",
  "Genesis AI Labs",
  "Genesis Brand & Design",
  "Multiple services",
  "Not sure yet",
] as const;

const BUDGETS = [
  "Under ₹5L",
  "₹5L – ₹15L",
  "₹15L – ₹50L",
  "₹50L+",
  "Not sure yet",
] as const;

const TIMELINES = [
  "Immediately",
  "Within a month",
  "1–3 months",
  "Just exploring",
] as const;

export const FORMS: Record<FormKind, FormSpec> = {
  /** A — creators applying to the Genesis network. */
  creator: {
    kind: "creator",
    submissionType: "CREATOR",
    title: "Work with Genesis",
    blurb:
      "Join the Genesis creator network. Tell us where you post and what you make — we brief creators for brand campaigns every week.",
    submitLabel: "Join the network",
    successMessage:
      "Thanks — you're in the network. We'll be in touch when a brief fits.",
    fields: [
      { name: "name", label: "Name", required: true, half: true, autoComplete: "name" },
      { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
      { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      { name: "city", label: "City", half: true, autoComplete: "address-level2" },
      { name: "instagram", label: "Instagram", half: true, placeholder: "@handle" },
      { name: "youtube", label: "YouTube", half: true, placeholder: "@channel" },
      { name: "niche", label: "Category / niche", half: true, placeholder: "Fashion, tech, food…" },
      { name: "followers", label: "Followers", half: true, placeholder: "Across your main platform" },
      { name: "avgViews", label: "Average views", half: true },
      {
        name: "portfolio",
        label: "Portfolio, profile or media kit link",
        type: "url",
        half: true,
        placeholder: "https://",
      },
      {
        name: "message",
        label: "Anything else we should know?",
        type: "textarea",
        max: 4000,
      },
    ],
  },

  /** B — brands starting a project. */
  brand: {
    kind: "brand",
    submissionType: "CONTACT",
    title: "Start a project",
    blurb:
      "Tell us what you're trying to do. The more you give us here, the more useful our first conversation is.",
    submitLabel: "Send brief",
    successMessage: "Thanks — we'll come back to you within a working day.",
    fields: [
      { name: "name", label: "Name", required: true, half: true, autoComplete: "name" },
      { name: "company", label: "Company", required: true, half: true, autoComplete: "organization" },
      { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
      { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      {
        name: "website",
        label: "Website or social",
        type: "url",
        half: true,
        placeholder: "https://",
      },
      {
        name: "need",
        label: "What do you need?",
        type: "select",
        options: NEEDS,
        required: true,
        half: true,
      },
      { name: "budget", label: "Budget range", type: "select", options: BUDGETS, half: true },
      { name: "timeline", label: "Timeline", type: "select", options: TIMELINES, half: true },
      {
        name: "message",
        label: "Project brief",
        type: "textarea",
        required: true,
        max: 4000,
        placeholder: "What are you launching, who is it for, and what does success look like?",
      },
    ],
  },

  /**
   * C — the popup. Four questions, and it must stay that way.
   *
   * The brief is explicit that a visitor should not fill in a large form for
   * every interaction. Email is required rather than "phone or email" because
   * the email column on contact_submissions is NOT NULL — accepting a phone
   * number alone would mean either inventing an address to satisfy the column
   * or a migration; phone is here as an optional second line instead.
   */
  quick: {
    kind: "quick",
    submissionType: "CONTACT",
    title: "Let's talk",
    blurb: "Four questions. We'll take it from there.",
    submitLabel: "Let's talk",
    successMessage: "Got it — we'll be in touch shortly.",
    fields: [
      { name: "name", label: "Name", required: true, half: true, autoComplete: "name" },
      { name: "company", label: "Company", half: true, autoComplete: "organization" },
      { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
      { name: "phone", label: "Phone", type: "tel", half: true, autoComplete: "tel" },
      {
        name: "message",
        label: "What can we help you with?",
        type: "textarea",
        required: true,
        max: 2000,
      },
    ],
  },
};

/** Columns on contact_submissions; everything else is metadata. */
export const COLUMN_FIELDS = new Set(["name", "email", "company", "message"]);

/**
 * Builds the validator from the field list, so the two cannot disagree.
 *
 * Optional text fields accept an empty string because that is what a browser
 * submits for an untouched input — treating "" as a type error would fail
 * every form where someone skipped an optional line.
 */
export function schemaFor(spec: FormSpec) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of spec.fields) {
    const max = field.max ?? (field.type === "textarea" ? 4000 : 200);
    let rule: z.ZodTypeAny;

    if (field.type === "email") {
      rule = z.email("Please enter a valid email address").max(max);
    } else if (field.type === "select") {
      rule = z.enum([...(field.options ?? [])] as [string, ...string[]]);
    } else if (field.type === "url") {
      // People type "instagram.com/x" far more often than a full URL, so this
      // stays a length-checked string rather than rejecting the common case.
      rule = z.string().trim().max(max);
    } else {
      rule = z.string().trim().max(max);
    }

    if (field.required) {
      if (field.type !== "select" && field.type !== "email") {
        rule = (rule as z.ZodString).min(1, `${field.label} is required`);
      }
    } else {
      rule = rule.optional().or(z.literal(""));
    }

    shape[field.name] = rule;
  }

  // Honeypot: real users never see it, so anything in it is a bot.
  shape.hp = z.string().max(0).optional().or(z.literal(""));
  shape.source = z.string().trim().max(120).optional().or(z.literal(""));

  return z.object(shape);
}
