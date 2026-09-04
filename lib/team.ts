/**
 * The team.
 *
 * PLACEHOLDER BY AGREEMENT. Genesis is supplying names, roles and headshots;
 * until then this carries the shape of the section and nothing that pretends
 * to be a person. Every member below is marked `pending`, and the page draws
 * a monogram tile rather than a grey avatar box — a broken-looking image is
 * read as a bug, a monogram is read as a portrait that has not arrived.
 *
 * TODO(content): real names, roles and headshots. Replace `pending` members
 * outright rather than editing them — the placeholders are not a starting
 * draft of anybody.
 */

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  /** Which of the four divisions they sit in, or "Leadership". */
  division: string;
  /** Portrait, once one exists. */
  photo?: string;
  /** One line, in their own words, once there is one. */
  line?: string;
  /** True while the person is a stand-in for a real one. */
  pending?: boolean;
};

/** Initials for the monogram tile, from whatever name we have. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const team = {
  label: "The team",
  heading: "The people",
  headingAccent: "behind it",
  body:
    "Genesis is built in-house — strategy, creative, production and technology under one roof. These are the people who do it.",
  members: [
    { slug: "founder", name: "Founder & CEO", role: "Founder & CEO", division: "Leadership", pending: true },
    { slug: "creative-director", name: "Creative Director", role: "Creative Director", division: "Genesis Studios", pending: true },
    { slug: "head-of-influence", name: "Head of Influence", role: "Head of Influence", division: "Genesis Influence", pending: true },
    { slug: "head-of-ai", name: "Head of AI Lab", role: "Head of AI Lab", division: "Genesis AI Labs", pending: true },
    { slug: "design-lead", name: "Design Lead", role: "Design Lead", division: "Genesis Brand & Design", pending: true },
    { slug: "production-head", name: "Production Head", role: "Production Head", division: "Genesis Studios", pending: true },
    { slug: "strategy-lead", name: "Strategy Lead", role: "Strategy Lead", division: "Genesis Influence", pending: true },
    { slug: "account-director", name: "Account Director", role: "Account Director", division: "Leadership", pending: true },
  ] as TeamMember[],
} as const;
