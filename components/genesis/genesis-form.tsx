"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";

import { submitGenesisForm, type SubmissionState } from "@/app/actions/contact";
import { FORMS, type FieldSpec, type FormKind } from "@/lib/forms";
import { cn } from "@/lib/utils";

/**
 * Renders any of the three lead forms from its spec.
 *
 * One component, because they are one machine: same validation, same rate
 * limit, same table, same honeypot, same error rendering. The only thing that
 * differs between a creator application and a project brief is the list of
 * questions, and that list is data.
 *
 * ACCESSIBILITY IS THE REASON THIS IS NOT A LOOP OVER <input>. Every field
 * gets a real <label> bound by id, `aria-invalid` when it fails, and its error
 * tied back to it through `aria-describedby` — so a screen reader announces
 * WHICH field is wrong and why, rather than a visitor discovering a red
 * outline they cannot see. The summary at the top is `role="alert"` so it is
 * announced when the server rejects the submission.
 */

const INITIAL: SubmissionState = { status: "idle" };

export function GenesisForm({
  kind,
  source,
  className,
  compact = false,
}: {
  kind: FormKind;
  /** Which page or CTA the submission came from. */
  source: string;
  className?: string;
  /** Drops the heading and blurb — for use inside a dialog that has its own. */
  compact?: boolean;
}) {
  const spec = FORMS[kind];
  const [state, formAction] = useActionState(submitGenesisForm, INITIAL);
  const formId = useId();

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={cn("glass glass-lit rounded-panel p-8 text-center", className)}
      >
        <p className="text-h3 font-normal tracking-tight text-bone">Received</p>
        <p className="mt-2 text-small text-ash">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className={cn(
        !compact && "glass glass-lit rounded-panel p-6 sm:p-8",
        className,
      )}
    >
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="source" value={source} />

      {/* Honeypot — off-screen, unlabelled to users, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-hp`}>Leave this empty</label>
        <input id={`${formId}-hp`} name="hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {!compact && (
        <header className="mb-6 flex flex-col gap-2">
          <h2 className="text-h3 font-normal tracking-tight text-bone">
            {spec.title}
          </h2>
          <p className="text-small leading-relaxed text-ash">{spec.blurb}</p>
        </header>
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mb-5 rounded-card border border-[var(--danger-border,rgb(255_120_120/0.35))] bg-[rgb(255_120_120/0.08)] px-4 py-3 text-small text-bone"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {spec.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            formId={formId}
            error={state.fieldErrors?.[field.name]}
          />
        ))}
      </div>

      <Submit label={spec.submitLabel} />
    </form>
  );
}

function Field({
  field,
  formId,
  error,
}: {
  field: FieldSpec;
  formId: string;
  error?: string;
}) {
  const id = `${formId}-${field.name}`;
  const errorId = `${id}-error`;
  const isWide = !field.half;

  /*
    A CONSENT BOX IS NOT A LABELLED FIELD. Every other row here is a label
    above a control; a terms checkbox is a control beside a sentence, and
    rendering it through the shared path would print the whole sentence in
    10px uppercase micro-label caps as if it were a field name. It also owns
    no "(optional)" suffix — the point of it is that it is required.
  */
  if (field.type === "consent") {
    return (
      <div className={cn("flex flex-col gap-1.5", isWide && "sm:col-span-2")}>
        <label htmlFor={id} className="flex items-start gap-3 text-small text-ash">
          <input
            id={id}
            name={field.name}
            type="checkbox"
            required={field.required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="mt-0.5 size-4 shrink-0 accent-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <span className="leading-relaxed">{field.label}</span>
        </label>
        {error && (
          <p id={errorId} className="text-micro text-[rgb(255_150_150)]">
            {error}
          </p>
        )}
      </div>
    );
  }

  /*
    A GROUP OF BOXES SHARING ONE NAME, which is what makes the action's
    getAll work. It is a fieldset rather than a div with a label: a label
    can only point at ONE control, so a screen reader on a plain div would
    announce six unlabelled checkboxes with no idea what the question was.
  */
  if (field.type === "checkbox-group") {
    return (
      <fieldset className={cn("flex flex-col gap-2", isWide && "sm:col-span-2")}>
        <legend className="micro-label !text-ash">
          {field.label}
          {!field.required && (
            <span className="ml-1 normal-case tracking-normal text-faint">
              (optional)
            </span>
          )}
        </legend>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {field.options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2.5 text-small text-bone"
            >
              <input
                type="checkbox"
                name={field.name}
                value={option}
                aria-describedby={error ? errorId : undefined}
                className="size-4 shrink-0 accent-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {error && (
          <p id={errorId} className="text-micro text-[rgb(255_150_150)]">
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  const shared = {
    id,
    name: field.name,
    required: field.required,
    autoComplete: field.autoComplete,
    placeholder: field.placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(
      "w-full rounded-card border bg-[var(--glass-fill)] px-3.5 py-2.5 text-small text-bone",
      "placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
      error ? "border-[rgb(255_120_120/0.6)]" : "border-[var(--glass-border)]",
    ),
  };

  return (
    <div className={cn("flex flex-col gap-1.5", isWide && "sm:col-span-2")}>
      <label htmlFor={id} className="micro-label !text-ash">
        {field.label}
        {!field.required && (
          <span className="ml-1 normal-case tracking-normal text-faint">
            (optional)
          </span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea {...shared} rows={4} />
      ) : field.type === "select" ? (
        <select {...shared} defaultValue="">
          {/* An empty first option, so a select does not silently default to
              its first real answer for someone who never opened it. */}
          <option value="" disabled={field.required}>
            Select…
          </option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input {...shared} type={field.type ?? "text"} />
      )}

      {error && (
        <p id={errorId} className="text-micro text-[rgb(255_150_150)]">
          {error}
        </p>
      )}
    </div>
  );
}

function Submit({ label }: { label: string }) {
  // useFormStatus must be read from inside the form, hence a child component.
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-small font-medium text-on-brand transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-60"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}
