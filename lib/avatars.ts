import { aiContent } from "./home-content";

/** One AI avatar, as the detail view needs it. */
export type Avatar = (typeof aiContent.avatars)[number];

export const avatars = aiContent.avatars;

export function findAvatar(slug: string): Avatar | undefined {
  return avatars.find((a) => a.id === slug);
}

/**
 * Placeholder ground for an avatar with no still yet, keyed by position so the
 * roster reads as seven different people rather than seven identical tiles.
 * Mirrors the fan's own ramp.
 */
export const AVATAR_TINT = [
  "122 60 255",
  "160 74 220",
  "214 90 175",
  "247 113 158",
  "255 143 120",
  "255 160 82",
  "255 200 90",
];
