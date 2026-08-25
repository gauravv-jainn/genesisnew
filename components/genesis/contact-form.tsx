"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitContactForm, type SubmissionState } from "@/app/actions/contact";
import { GlassButton } from "./glass-button";
import { cn } from "@/lib/utils";

/**
 * The one public form on the site, reused by contact, creator and careers.
 *
 * Validation is server-side (Zod, in the action) and mirrored back per field;
 * the browser's own `required`/`type=email` handling is left in place as a
 * first pass so most users never round-trip to see an error.
 */

const INITIAL: SubmissionState = { status: "idle" };

export function ContactForm({
  type,
  source,
  submitLabel = "Send",
  showCompany = true,
  showMessage = true,
  messageLabel = "What are you working on?",
  className,
}: {
  type: "CONTACT" | "CREATOR" | "CAREERS_WAITLIST";
  /** Which page the submission came from. */
  source: string;
  submitLabel?: string;
  showCompany?: boolean;
  showMessage?: boolean;
  messageLabel?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(submitContactForm, INITIAL);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "glass glass-lit rounded-panel p-8 text-center",
          className,
        )}
      >
        <p className="text-h3 font-semibold text-bone">Received</p>
        <p className="mt-2 text-small text-ash">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className={cn("glass glass-lit rounded-panel p-6 sm:p-8", className)}
    >
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="source" value={source} />

      {/* Honeypot — hidden from users, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`website-${source}`}>Website</label>
        <input
          id={`website-${source}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          autoComplete="name"
          error={state.fieldErrors?.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
        />
        {showCompany && (
          <Field
            label="Company"
            name="company"
            autoComplete="organization"
            error={state.fieldErrors?.company}
            className="sm:col-span-2"
          />
        )}
        {showMessage && (
          <Field
            label={messageLabel}
            name="message"
            multiline
            error={state.fieldErrors?.message}
            className="sm:col-span-2"
          />
        )}
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 text-small text-brand-ink">
          {state.message}
        </p>
      )}

      <div className="mt-8">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  // useFormStatus must be read from a child of the <form>, not the form itself.
  const { pending } = useFormStatus();

  return (
    <GlassButton variant="brand" size="lg" type="submit" disabled={pending} arrow>
      {pending ? "Sending…" : label}
    </GlassButton>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  multiline = false,
  autoComplete,
  error,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const shared = cn(
    "w-full rounded-card border bg-white/[0.04] px-4 py-3 text-small text-bone",
    "placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-brand",
    error ? "border-brand/60" : "border-white/12",
  );

  return (
    <div className={className}>
      <label htmlFor={id} className="micro-label mb-2 block">
        {label}
        {required && <span className="ml-1 text-brand-ink">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-small text-brand-ink">
          {error}
        </p>
      )}
    </div>
  );
}
