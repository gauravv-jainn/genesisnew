# Genesis Media — Build Progress

Single source of truth for project state. Check this before resuming work in a
new session.

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Infra & security foundation | ✅ Code complete — 5 checks pending credentials |
| 1 | Design system & shared components | ✅ Complete — **needs your call on brand colour** |
| 2 | Homepage (13 sections) | ⬜ Not started |
| 3 | Motion pass | ⬜ Not started |
| 4 | Standalone pages | ⬜ Not started |

---

## Phase 0 — Infra & security foundation

### Built

**Scaffold**
- Next.js **16.3.1** (App Router, Turbopack), React 19.2, TypeScript strict.
- Tailwind **v4** (CSS-first config — there is no `tailwind.config.ts`; tokens
  live in `@theme` inside `app/globals.css`), shadcn/ui (`base-nova` style).
- Homepage lives at `app/(home)/page.tsx` so Phase 2 sections can colocate
  under `app/(home)/components/` as specified.

**Installed & configured:** Framer Motion 13, GSAP 3.15, Lenis 1.3, Prisma 7.9,
Auth0 SDK 4.26, Sentry 10.70, Vercel Analytics 2.0, Zod 4.4, googleapis 174,
Upstash rate limiting.

> Framer Motion, GSAP and Lenis are **installed but not yet wired into any
> component** — that is Phase 1/3 work, deliberately not started.

**Database** — `prisma/schema.prisma`, three tables only (`users`,
`audit_logs`, `contact_submissions`). Initial migration SQL is generated and
committed at `prisma/migrations/0_init/migration.sql`; it has **not been
applied** to a database yet.

**Auth** — `lib/auth0.ts` (Auth0Client + role sync), `proxy.ts` (optimistic
gate), `app/insider/layout.tsx` (authoritative gate), `lib/access.ts`.

**Storage** — `lib/google-drive.ts`: service-account Drive v3 client plus
`verifyDriveAccess()`. No upload UI, as specified.

**Monitoring** — Sentry client/server/edge configs + `instrumentation.ts`;
`<Analytics />` in the root layout.

**Security** — `lib/security-headers.ts` applied to every route via
`next.config.ts`. Verified live: CSP, HSTS, X-Frame-Options, X-Content-Type-
Options, Referrer-Policy, Permissions-Policy, COOP, X-DNS-Prefetch-Control.

### Verified working

- `npm run build`, `npm run lint`, `npm run typecheck` all pass clean.
- `npm audit` → **0 vulnerabilities**.
- All security headers present on live responses (checked with `curl -I`).
- `/insider` renders a "not configured" notice instead of 500-ing while Auth0
  credentials are absent — the marketing site stays up regardless.
- `/api/diagnostics` returns 401 without a token, 401 with a wrong token, and
  503 if `DIAGNOSTICS_TOKEN` is itself unset or a placeholder.
- Prisma schema validates; migration SQL generates correctly.

### ⚠️ Blocked on credentials — 5 unverified DoD checks

These cannot be confirmed until real secrets exist. **Nothing else in Phase 0
is blocked by them.**

| Check | How to verify once credentials land |
| --- | --- |
| Deploys to Vercel | Push + import the repo in Vercel |
| `/insider` → Auth0 login → back | Visit `/insider` in a browser |
| Test write to `audit_logs` | `/api/diagnostics` → `auditLogWrite: ok` |
| Sentry receives a test error | `/api/diagnostics?sentry=throw` |
| Drive API authenticates | `/api/diagnostics` → `googleDrive: ok` |

**One command runs four of the five:**

```bash
curl -s -H "x-diagnostics-token: $DIAGNOSTICS_TOKEN" "http://localhost:3000/api/diagnostics?sentry=throw" | python3 -m json.tool
```

Every subsystem currently reports `skipped` — which is the endpoint correctly
detecting placeholder values, not a failure.

### What I need from you

1. **Neon** — pooled `DATABASE_URL` *and* unpooled `DIRECT_DATABASE_URL`.
   Migrations need the direct one (PgBouncer lacks the advisory locks the
   migration engine takes). Keep `sslmode=require` on both.
2. **Auth0** — domain, client ID, client secret, for a **Regular Web
   Application**. Register `{APP_BASE_URL}/auth/callback` as an Allowed
   Callback URL and `{APP_BASE_URL}` as an Allowed Logout URL. To grant
   Insider access, add an Auth0 Action that puts roles on the
   `https://genesismedia.co/roles` claim (`owner`/`admin`/`member`/`viewer`).
   **Users default to `VIEWER`, which is denied** — that is intentional.
3. **Google Cloud** — service account JSON, base64-encoded into
   `GOOGLE_SERVICE_ACCOUNT_JSON`. Share the target Drive folder with the
   service account's `client_email` or it authenticates into an empty Drive.
4. **Sentry** — DSN (as `NEXT_PUBLIC_SENTRY_DSN`), plus org/project/auth token
   for source map upload.
5. **Brand assets** — real colors, fonts, logos. See *Placeholders* below.
6. **Wix decision** — replace `genesismedia.co` outright, or run in parallel
   first? Doesn't block Phases 1–4; it blocks DNS cutover only.

Then run:

```bash
npm run db:deploy
```

### Decisions taken (flagging, since they're expensive to reverse)

- **Prisma 7 requires a driver adapter** — the engine no longer connects on its
  own. Using `@prisma/adapter-neon` (WebSocket), which suits Vercel's
  short-lived functions. *Consequence:* local development needs a Neon branch;
  a plain local Postgres will not work with this adapter. Neon's free branching
  is the intended workflow. Switching to `@prisma/adapter-pg` would allow local
  Postgres at the cost of TCP pooling behaviour on serverless.
- **Middleware is `proxy.ts` in Next 16**, not `middleware.ts`, and runs on the
  Node runtime only. The Auth0 SDK supports this explicitly.
- **`npm audit` fix without downgrading Prisma** — a high-severity advisory in
  `deepmerge-ts@7.1.5` (transitive, via `@prisma/config`) would have forced
  `prisma@6.12`. Resolved with a `deepmerge-ts: ^8.0.1` override in
  `package.json` instead; Prisma 7.9.1 verified working afterwards.
- **Tailwind v4 has no JS config file.** Any instruction to "add it to
  `tailwind.config.ts`" now means `@theme` in `app/globals.css`.

### Placeholders in use — replace when brand assets arrive

- **Colors** — shadcn's default neutral OKLCH palette. The `--bg #0a0a0b`,
  `--accent-amber #ff8a3d`, `--accent-teal #2dd4bf` tokens from the brief are
  **not yet applied**; Phase 1 introduces them after reviewing
  `docs/reference/`.
- **Typeface** — Geist, standing in for the bold-sans + serif-italic pairing.
- **Copy** — the placeholder homepage is scaffolding, replaced wholesale in
  Phase 2.

### Hardening follow-ups (not yet done, deliberately)

- **CSP allows `'unsafe-inline'` for `script-src`.** Next.js inlines its
  hydration payload, so a nonce-free policy must permit it. Proper nonce-based
  CSP requires injecting a nonce at the proxy layer, which conflicts with the
  Auth0 proxy owning the response on every request. The policy still blocks
  third-party scripts, framing, plugins and off-site form posts.
- **Rate limiting falls back to an in-memory limiter** when Upstash is
  unconfigured. That is per-instance and **not sufficient in production** —
  set `UPSTASH_REDIS_REST_URL` / `_TOKEN` before the Phase 4 forms go live.
- **Field-level encryption (`pgcrypto`) not implemented.** Correct for now —
  no payment or invoice data exists yet. Revisit when invoicing lands.
- `audit_logs` stores IP and user agent (PII) — fine for a security audit
  trail, but it needs a retention policy before launch.

### Explicitly NOT built

The Genesis Workspace product — client/brand/project management, content
pipeline, invoicing, automations, influencer CRM, team permissions beyond the
Insider gate. Out of scope per the brief. The Phase 0 infra is arranged so
these can be added without re-architecting.

---

## Phase 1 — Design system & shared components

### ⚠️ Decision needed: the brand accent is red, not amber/teal

I read all 37 images in `docs/reference/` before writing any code, as the
brief instructed. **Two of them are existing Genesis Media artwork, not mood
references**: `img-012` (an Influencer Campaigns page) and `img-013` (an "Our
Content" library). Both carry the real GENESIS MEDIA lockup and both are built
on a **crimson/red** accent — red CTA gradients, a red star glyph, red glows.

The brief's placeholder tokens were `--accent-amber #ff8a3d` and
`--accent-teal #2dd4bf`. Since §4 said those were "a starting approximation,
not the final word" and told me to let the references decide, I built:

- **`crimson` `#ff2d3f`** — primary. Sampled from the Genesis CTA gradient and
  logo mark. Drives buttons, focus rings, brand glows.
- **`amber` `#ff8a3d`** — secondary, kept from the brief. It genuinely earns
  its place: the papers-catching-light motif is warm in every image that uses
  it (img-001, 005, 011, 014, 043), and that motif is the connective thread
  across Journey / Blogs / Case Studies.
- **`teal` `#2dd4bf`** — defined but effectively unused. It appears **nowhere**
  in the references. The only cool accents present are a lime `#c5ff2e`
  (img-009 pushpins) and a signal green (img-004).

**Confirm before Phase 2**: is crimson right? Everything downstream inherits
it, so it is cheap to change now and expensive after 13 sections exist. If you
prefer amber-primary, it is a one-file edit to `app/globals.css`.

### Also found in the references

`img-019` is your **current Wix site** mid-edit, which gave me real Genesis
copy rather than invented filler. Now in `lib/site-config.ts`:

> "Genesis is a Gen Z-led full-service agency where strategy, content, and
> technology come together to build iconic brands…"

Note the live site's hero has a typo — "Technolgy". I have **not** reproduced
it. Flagging so it gets fixed at the source too.

### Built

**Tokens** (`app/globals.css`) — Tailwind v4 `@theme`, dark-only. Surfaces
(`void`/`ink`/`elevated`/`raised`), accents, text ramp (`bone`/`ash`/`faint`),
glass variables, and a global `prefers-reduced-motion` reset.

**Glass** is the One UI "Blur" style, decided directly from `img-000` — which
is literally a labelled comparison of Frosted / Clear (iOS) / Blur (One UI).
Heavy blur, low-contrast fill, lit top edge, no refraction. `.glass`,
`.glass-strong`, `.glass-lit`.

**The eight required components**, all in `components/genesis/`:

| Component | File | Reference |
| --- | --- | --- |
| Glass pill button (+ segmented) | `glass-button.tsx` | img-012, img-014 |
| Glass nav | `glass-nav.tsx` | img-013, img-015 |
| Stat card + stat row | `stat-card.tsx` | img-012, img-036 |
| Orbiting / draggable cards | `orbiting-cards.tsx` | img-012 |
| Movie-poster case-study card | `poster-card.tsx` | img-025, img-026 |
| Animated timeline | `animated-timeline.tsx` | img-004 |
| Logo marquee | `logo-marquee.tsx` | — |
| Magnetic floating paper card | `paper-card.tsx` | img-009, img-011, img-053 |

Plus supporting pieces that stop the above from duplicating each other:
`atmosphere.tsx` (ground + one light + grain), `section-label.tsx`,
`genesis-mark.tsx` (placeholder logo), `lib/use-magnetic.ts`,
`lib/site-config.ts`.

**`/style-guide`** renders all of it in isolation. Dev-only: it calls
`notFound()` in production and is linked from nothing.

### Verified

Build, lint, typecheck all clean; `npm audit` 0 vulnerabilities. Rendered the
style guide in a browser and confirmed against the SSR HTML that every
component emits markup. **Three real bugs surfaced only by running it:**

1. **Hydration mismatch in `OrbitingCards`.** Framer Motion serialises style
   values at reduced precision during SSR, so `17.639320225002095%` on the
   client met `17.6393%` from the server. Fixed by rounding in the transform
   so both sides produce identical strings.
2. **`aspect-2/3` generated no CSS.** Tailwind v4 has no bare-fraction aspect
   utility — the poster cards had no aspect ratio at all. Now `aspect-[2/3]`,
   confirmed by grepping `aspect-ratio: 2 / 3` out of the compiled stylesheet.
3. **CSP blocked Vercel Analytics** (fixed in the previous commit) — the
   script is same-origin only once deployed to Vercel.

### Still placeholder

- **Typefaces** — Geist (sans) + Instrument Serif (the italic accent word).
  Both stand-ins for real brand fonts.
- **Logo** — `genesis-mark.tsx` is reconstructed from the references. One file
  to swap.
- **Poster artwork** — generated from a hash of each card's id so cards look
  distinct and stable across SSR. Deterministic on purpose: `Math.random()`
  would cause hydration mismatches.
- **Client logos** — wordmarks, not images.
- All figures and names are marked `TODO(copy)`.

### Deliberately deferred to Phase 3

Framer Motion and GSAP are installed; only component-intrinsic motion is wired
(count-up, orbit, magnetic hover, timeline fill, marquee). The `layoutId`
morphs, the Services→Portfolio 180° pan, and Lenis smooth scroll are the
Phase 3 motion pass and are not started.

---

## Repository

Remote is `https://github.com/gauravv-jainn/genesisnew`, set as `origin`.

**Commits are local — nothing has been pushed.** This machine has no GitHub
credentials (no `gh` CLI, no SSH key, no credential helper), so pushing is
yours to run:

```bash
git push -u origin main
```

## Commands

```bash
npm run dev        # dev server
npm run build      # prisma generate + next build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run db:migrate # create + apply a migration (dev)
npm run db:deploy  # apply pending migrations (prod/CI)
npm run db:studio  # browse data
```
