import { cn } from "@/lib/utils";

/**
 * Social links as stars — the spec's "Social Media Icons (like stars)".
 *
 * The Genesis lockup carries a four-point star, so the social row repeats it:
 * each link is that star shape rather than a circle, with the platform mark
 * held inside. The star is a clip-path on the tile, so the glow and the hover
 * state take its silhouette instead of sitting in a square behind it.
 *
 * The marks are drawn inline. lucide-react removed its brand icons in v1, and
 * pulling in a whole icon package for three glyphs is not a trade worth
 * making.
 *
 * TODO(links): handles are placeholders until the real accounts are confirmed.
 */

const STAR =
  "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)";

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="4.5" />
      <path d="M10.2 9.2 15 12l-4.8 2.8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6" strokeLinecap="round" />
      <circle cx="7.5" cy="7.6" r="1.05" fill="currentColor" stroke="none" />
      <path d="M11.5 16.5v-3.4a2.1 2.1 0 0 1 4.2 0v3.4" strokeLinecap="round" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Mark: InstagramMark },
  { label: "YouTube", href: "https://youtube.com", Mark: YouTubeMark },
  { label: "LinkedIn", href: "https://linkedin.com", Mark: LinkedInMark },
];

export function SocialStars({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {SOCIALS.map(({ label, href, Mark }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            className="group relative grid size-14 place-items-center"
          >
            {/* The star itself. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-white/[0.07] transition-colors duration-300 group-hover:bg-brand/70"
              style={{ clipPath: STAR }}
            />
            {/* Bloom on approach, taking the star's silhouette. */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                clipPath: STAR,
                background:
                  "radial-gradient(60% 60% at 50% 50%, rgb(255 120 130 / 0.5), transparent 70%)",
              }}
            />
            <span className="relative size-4 text-ash transition-colors duration-300 group-hover:text-white">
              <Mark />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
