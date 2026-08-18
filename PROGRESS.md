# Genesis Media — Build Progress

Single source of truth for project state. Check this before resuming work in a
new session.

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Infra & security foundation | ✅ Code complete — 5 checks pending credentials |
| 1 | Design system & shared components | ✅ Complete — **needs your call on brand colour** |
| 2 | Homepage (13 sections) | ✅ Complete |
| 3 | Motion pass | ✅ Complete |
| 4 | Standalone pages | ✅ Complete |

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

- **CSP allows `'unsafe-inline'` for `script-src` — a deliberate trade-off,
  not outstanding debt.** Next inlines its hydration payload, so removing it
  requires nonces. Next's own documentation is explicit that *"to use a nonce,
  your page must be dynamically rendered… Static pages are generated at build
  time, when no request or response headers exist—so no nonce can be
  injected."* Adopting nonces would therefore force every marketing page off
  static generation — losing CDN caching and TTFB — to defend against an
  inline-injection vector this site does not have, since no user-generated
  content is rendered inline. Revisit only if these pages become dynamic for
  some other reason. The policy still blocks third-party scripts, framing,
  plugins and off-site form posts.
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

## Phase 2 — Homepage

### Built

All 13 sections in the specified order, one component each under
`app/(home)/components/`:

Hero → Services → Portfolio → Case Studies → Our Journey → AI-Generated
Content → Influencer Marketing → Branding & Design → Client Logo Wall →
Testimonials → Journal teaser → Insider teaser → Footer CTA.

Two shared primitives keep the sections from re-deciding the same things:
`components/genesis/reveal.tsx` (the single scroll fade/slide, plus a stagger
group) and `app/(home)/components/section-shell.tsx` (label → two-tone heading
→ body, spacing, and per-section atmosphere). Copy lives entirely in
`lib/home-content.ts`.

**Route stubs.** `/our-work`, `/blog`, `/blog/[slug]`, `/creator`, `/careers`
and `/influencer-campaigns` now resolve via a shared `RouteStub` so the
homepage ships no dead links. These are placeholders, replaced wholesale in
Phase 4 — the `[slug]` route only resolves the three placeholder posts and
404s anything else.

### Verified

Build, lint, typecheck clean; `npm audit` 0 vulnerabilities. Every internal
link on the homepage resolves 200 (checked by extracting hrefs and curling
each). No horizontal overflow at 375 / 768 / 1440. Mobile nav opens and
reports `aria-expanded="true"`. All 11 section headings confirmed to reveal to
full opacity on scroll.

**Four issues found by running it, all fixed:**

1. **Primary CTA below the fold.** At 1440×900 the hero measured 1054px, so
   "Start a project" (bottom edge 910px) and the scroll cue sat off-screen —
   the single worst thing a hero can do. The headline is long real copy that
   wraps to six lines. Fixed by trimming the vertical budget and moving the
   scroll cue out of flow; hero now measures exactly 900px with both visible.
2. **`xl:text-7xl` was width-gated only**, so a wide-but-short laptop got a
   72px headline it had no room for. Now gated on width *and* height.
3. **Invalid CSS from an arbitrary variant.** Tailwind emitted
   `(min-width:1280px)and(min-height:960px)` — no spaces, unparseable, 500 on
   every page. Spaces must be written as underscores in arbitrary variants.
4. **Orbiting cards clipped** at the section edge in the narrower two-column
   layout. Orbit radius reduced; verified zero cards escape the container.

### Copy status

Real Genesis material wherever it existed in `docs/reference/`: the hero and
body copy (img-019), the influencer positioning line and all five figures
(img-012), and the client and format lists (img-013).

**Invented and must be replaced before launch:**
- All four case-study results — the numbers are fabricated placeholders.
- All three testimonials, including names and roles.
- The journey milestones and dates.
- The three journal posts.
- Service descriptions (structure is a guess at the real six-way split).

**Also needs a decision:** client names (Kayali, Tata Motors, ICICI Bank,
Miraggio, Yonex, Third Wave Coffee, Mauritius Tourism, Kreo Tech, Dot & Key)
come from Genesis's own artwork, but display rights on the new public site
should be confirmed.

---

## Spec document — content corrected

You supplied **"Genesis Website Content.pdf" (Layout(Gaurav): FINAL)**. Its
images are the same set as `docs/reference/`, but it carries an **annotation
layer** that was the missing piece. Extracted text is at
`scratchpad/genesis-content.txt`.

It showed my Phase 2 copy was substantially wrong. Corrected in
`lib/home-content.ts`:

| Was (invented) | Now (from the spec) |
| --- | --- |
| Kayali, Tata Motors, ICICI, Yonex… | **Aditya Birla Capital, HDFC, Aditya Birla Sun Life Insurance, Mahindra Finance** |
| 6 invented services | **5: Content Production, AI Content, Influencer Marketing, Branding & Design, Apps & Games** |
| Invented hero line | **"Empowering brands that want to win at content, influencer activations & AI"** |
| — | **AI avatars: Adi, Diya, Ivaanat, Shivam, Tanvi** |
| — | **Celebrities: Vikrant Massey, Ajay Devgn, Akash, Rashmi, Parvi** |
| 3 fabricated testimonials | **12 real names/companies** (Anu Raj–Mahindra, Amey Khopte–ABSLI, Aditya Rane–IndusInd Nippon, …) |
| — | **Branding work: Tripgate, Abhi App, Doja** |

Behaviour directives from the same document are now implemented, and are
recorded next to the content they govern.

## Phase 3 — Motion pass

- **Services → Portfolio camera turn.** Spec: *"when going from services to
  portfolio the camera turns 180*"*. Both sections are the two faces of one
  stage; GSAP ScrollTrigger pins it and scrubs yaw 0°→180°. Verified scrubbing
  linearly (0/50/100/150/180) and confirmed absent below 1024px.
- **Apple Watch clusters.** Spec asks for this twice — client logos
  *"movable like Apple Watch Apps"* and testimonials *"move around like how
  apps move around in an apple watch"*. `WatchCluster` puts items on a
  honeycomb lattice in a draggable plane; each scales by distance from centre,
  driven by MotionValues so dragging never re-renders.
- **Lenis smooth scroll**, wired into GSAP's ticker with
  `lenis.on("scroll", ScrollTrigger.update)` and `lagSmoothing(0)`. Disabled
  for reduced-motion and coarse pointers.
- **Magnetic floating paper blogs** already carried the motif; the spec
  confirms the intent (*"papers moving like magnetics"*, ref igloo.inc).

### ⚠️ Verification limit you should know about

This browser pane **does not emit `scroll` events for programmatic scrolls** —
`window.scrollTo` moves the page but fires zero events. Every scroll-driven
library correctly stays at progress 0 under that condition, which made a
working animation look broken and sent me rewriting it twice before I checked
the harness instead of the code. Scroll-driven work here is verified by
dispatching a synthetic `scroll` event after moving.

**The mechanism is confirmed; the *feel* is not.** Scroll the turn yourself —
pacing and the 160% pin length are taste calls I cannot make from a script.

### Still owed before launch

- Every case-study **result** figure, all 12 testimonial **quotes**, journey
  milestones and dates, and the three journal posts.
- Assets: client logo files ("Ask tanvi"), AI avatar stills, portfolio
  thumbnails, video testimonials.
- Confirm spellings: the document writes "Vikhrant Messay" / "Ajay Devgan".
- The crimson-vs-amber brand call is still open.

---

## Phase 4 — Standalone pages

### Built

| Route | What it is |
| --- | --- |
| `/our-work` | The content library ("Genesis' NETFLIX"). All 8 spec categories as filter tabs over a poster grid. |
| `/influencer-campaigns` | Deep dive: figures, celebrity collaborations, creator genres, the four-step process, enquiry form. |
| `/creator` | "I'm a Creator" — why work with Genesis, plus a roster application form. |
| `/careers` | The waitlist, modelled on img-044: one glass panel, one action. |
| `/blog` | Hub. Posts render as magnetic floating papers, per the spec's "each paper is a blog". |
| `/blog/[slug]` | MDX post template with scoped prose styles. |
| `/insider` | Dashboard shell behind the Auth0 gate. |

**Forms.** One `ContactForm` serves contact, creator and careers. It posts to a
server action that validates with Zod, rate-limits by IP, writes to
`contact_submissions`, then records an audit entry — in that order, so nothing
touches the database before validation passes. A honeypot field catches bots
and is accepted silently rather than rejected.

**Blog.** Posts are MDX in `content/blog`, parsed with gray-matter and
validated with Zod — malformed frontmatter fails the build rather than
rendering blank. The homepage teaser reads the same files as `/blog`, so the
two cannot drift.

**Insider.** Deliberately narrow. The one live panel is recent contact
submissions, because that table is genuinely ours; the Workspace modules
(clients, projects, pipeline, invoicing) appear as locked placeholders so the
shape is visible without implying they exist.

### Verified

Build, lint, typecheck clean; `npm audit` 0 vulnerabilities.

- **Zero dead links.** Crawled every page, extracted all internal hrefs, and
  curled each: 9 distinct links, all 200. Unknown blog slugs 404 correctly.
- **The form works end to end.** A valid submission reaches the action and
  returns *"not connected to a database yet"* — the DB guard refusing to
  pretend it saved. With the browser's own `type=email` check bypassed, the
  server's Zod validation still returns a field-level error and sets
  `aria-invalid`.
- **Content library filters**: 9 items, Films → 2, AI Content → 1,
  `aria-selected` tracked.

### ⚠️ The three blog posts are drafts, so production shows an empty journal

I wrote the two AI posts the spec asks for, plus a creative-process piece. All
three carry `draft: true`, so they are visible in development and **excluded
from production** — the production build generated zero post pages, and
`/blog` will read "No posts published yet".

That is deliberate: they are my drafts, not Genesis's writing, and they end
with a sign-off note. Publishing is a one-word change per file
(`draft: false` in the frontmatter) once you have read them.

### Still owed

Unchanged from earlier phases: case-study results, testimonial quotes, journey
dates, real assets (client logos, avatar stills, portfolio thumbnails), and
the crimson-vs-amber brand decision. Plus, for these pages specifically:
real content-library thumbnails and video links.

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
