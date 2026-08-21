# Design QA audit — Genesis Media

Audited 2026-08-21 against `docs/reference/` (37 unique images), `docs/spec/pages/`
(59 files, 37 unique — the rest are byte duplicates), `docs/spec/website-content-annotations.txt`
and `PROGRESS.md`.

## How to read this

Every finding names the reference or spec line it is measured against, the file
and line that implements it, and a concrete fix. Numbers are sampled from the
actual images and from the served HTML on `localhost:3000` — not estimated.

| Severity | Meaning |
| --- | --- |
| **fundamentally wrong** | The archetype is wrong. Rebuild the section. |
| **needs rework** | Right idea, wrong execution. Targeted edit. |
| **cosmetic** | Values are off. Tune. |

**Tooling limitation, stated up front.** Playwright is not installed and no
browser automation is available. The in-app browser pane went hidden mid-session
and returns black frames. Verification here is (a) headless Chrome full-viewport
captures, (b) DOM/computed-style measurement, (c) pixel measurement of the
reference images, (d) code-level comparison against the design tokens. Anywhere
a verdict is limited by that, it says so.

**Coverage is uneven and you should know where.** Four section groups were
audited in depth. The global layer was measured directly. Five were audited at
code level only — shallower, and marked as such.

| Target | Verdict | Depth |
| --- | --- | --- |
| Global design system | **needs rework** | measured directly |
| Hero | **fundamentally wrong** | deep |
| Services + Portfolio | **fundamentally wrong** | deep |
| Case Studies + Journey | **fundamentally wrong** | deep |
| Creative Process + AI Content | **fundamentally wrong** | deep |
| Influencer + Branding | needs rework | code level only |
| Client Logos + Testimonials | mostly passes | code level only |
| Blog / Insider / Footer | needs rework | code level only |
| `/our-work`, `/blog` | needs rework | code level only |
| Thin pages | needs rework | measured, not diagnosed |

---

## 0. Global design system — needs rework

Everything inherits from this layer, so it is fixed first.

### 0.1 Glass is a tenth of the reference — **needs rework**

**Spec.** `img-000` is a labelled Frosted / Clear / **Blur** comparison, and
`PROGRESS.md:212` records that Genesis's glass is the One UI "Blur" style:
heavy blur, low-contrast fill, lit top edge. Measured luminance lift of a glass
panel over its own background:

| Sample | Lift |
| --- | --- |
| `img-000` One UI "Blur" panel | **+34.2** |
| `p07_0` figures bar — Genesis's own artwork | **+18.6** |
| `p07_0` database card — lit glass | **+29.9** |
| **our `.glass`, measured on the hero nav** | **+3.4** |

**Actual.** `globals.css:94-95` — `--glass-fill: rgb(255 255 255 / 0.05)`,
`--glass-fill-strong: rgb(255 255 255 / 0.08)`.

**What's wrong.** Glass reads as a thin outlined pill, not a milky blurred
panel. On a `#0a0a0b` ground a 5% white fill lifts luminance by ~12; Genesis's
own artwork calls for ~18.6, which needs ~7.6%.

**Fix.** `--glass-fill` → `0.075`, `--glass-fill-strong` → `0.12`. 40 files
inherit this; no per-section edits needed.

### 0.2 The nav bypasses the design system — **needs rework**

**Actual.** `glass-nav.tsx:34-37` hardcodes `rgba(255,255,255,0.03)` at rest
and `blur(12px)` — against the token system's 5% / 24px. It never uses `.glass`.

**What's wrong.** The most visible glass element on the site is the weakest,
and it opted out of the one place the glass is defined, so fixing the token
would not have fixed the nav.

**Fix.** Drive the nav from the tokens; keep the scroll-condense as a step
between `--glass-fill` and `--glass-fill-strong`.

### 0.3 `GhostType` is below the grain floor — **needs rework**

**Spec.** In `img-009` the ghosted display type is legible mid-grey behind the
cards and is what gives the scene its scale. In `p27_1` the equivalent is pure
white (sampled `253,254,255`) at ~12:1 against its ground.

**Actual.** `spotlight.tsx:132` — `color: rgb(255 255 255 / 0.035)`. Over
`#08080a` that composites to about `#111112`: roughly nine levels of luminance.

**What's wrong.** Measured grain amplitude on this site is **3.36 std**. The
ghost type is *below the amplitude of the noise painted on top of it* — it is
mathematically present and visually absent. Every section that relies on it for
scale gets nothing.

**Fix.** Filled variant → `0.12`, outlined → `0.07`. Drop `whitespace-nowrap`
and set a max-width so the phrase wraps, as in `img-009`.

### 0.4 Placeholder poster art is green on a crimson brand — **fundamentally wrong**

**Spec.** Brand is crimson `#ff2d3f` with amber secondary. `PROGRESS.md:189`
records that green/teal appears **nowhere** in the references.

**Actual.** `poster-card.tsx:36-46` hashes each id into an unconstrained
0–359 hue: `hsl(${hue} 70% 45% / 0.85)`. For the four live portfolio ids that
resolves to hue **92** (lime), **105** (green), **343** (pink), **135** (green)
— confirmed verbatim in the served HTML.

**What's wrong.** Three of the four cards in the homepage's flagship client row
render lime/green — directly under *Aditya Birla Capital*, *HDFC* and *Mahindra
Finance*. On a black-and-crimson site this is the loudest colour on the page and
it belongs to no part of the palette.

**Fix.** Constrain the hash to the brand arc (350°–30°) and drop it to graphite
saturation.

### 0.5 Teal is the joint-most-used tone and is in none of the references — **needs rework**

**Actual.** `tone="teal"` in `ai-content.tsx:36`, `insider-teaser.tsx:18`, and
three places in `journey.tsx`. Ties crimson as the most-used `tone` prop.

**What's wrong.** `PROGRESS.md:190` calls teal "effectively unused" and notes it
appears nowhere in the references. Journey's use is documented and defensible —
the one deliberately cold section. The other two are not.

**Fix.** `ai-content` → crimson. `insider-teaser` → crimson.

### 0.6 Five sections bypass `SectionShell` — **cosmetic**

`hero`, `journey`, `creative-process`, `client-logos`, `footer-cta`. Three use
different heading scales and lose the `lg:py-40` rhythm step. Deliberate for
`hero` and `influencer` (both match their own mockups); unintended elsewhere.

### Passing

**Grain** — the spec's "gradient + noise". Amplitude **3.36 std**, squarely in
the visible 2–4 band. Working.

---

## 1. Hero — fundamentally wrong

### 1.1 The document wall's curvature is inverted — **fundamentally wrong**

**Spec.** `p01_1`: five identical sheets on a **concave** arc wrapping toward
the camera. The outer sheets are the *largest* objects on screen. The wall spans
~90% of frame width (bright pixels x=6%→96%).

**Actual.** `document-wall.tsx:102` composes `rotateY(θ) translateZ(620px)`
under a parent at `translateZ(-620px)` (line 81). Flanks land at
z = 620(cos40°−1) = **−145px** — they *recede*. Panel heights in the served HTML
are 368 / 446 / 524 / 446 / 368.

**What's wrong.** Both perspective and sizing peak at the centre, so the wall
renders as a symmetric pyramid — a fan folding *away* from you. The reference's
defining gesture is an amphitheatre closing *around* the figure. This is the
exact "bar chart" failure the file's own header comment claims to have fixed.

**Fix.** Invert the ring: `translateZ(r) rotateY(θ) translateZ(-r)` and drop the
parent offset. Set `falloff={0}` — the reference's sheets are identical
rectangles; let perspective alone produce the size difference. Raise `step` to
~24°.

### 1.2 Sheet colour goes khaki instead of orange — **fundamentally wrong**

**Spec.** Sampled from `p01_1`, mean sheet colour left→right:
`rgb(243,120,16)` / `(251,177,47)` / `(252,196,65)` / `(251,179,49)` /
`(247,135,20)`. **Red stays pegged at 243–252 on every sheet**; only G and B
fall. Flanks are darker because they are *more saturated orange* (R−B = 227).

**Actual.** `document-wall.tsx:28-33` `dim()` multiplies all three channels by
the same k. Served top stops: centre `rgb(255,240,148)` (R−B 107), outer
`rgb(162,144,89)` (R−B 73, lum 145).

**What's wrong.** A neutral-density multiply drains ivory into olive-khaki. At
lum 145 against a lum ~120 sky the far sheets sit at ~1.15:1 contrast — they
dissolve into the room glow and the wall loses its outer edges.

**Fix.** Hue-preserving ramp: keep R ≥ 240 on every sheet, pull only G and B.
Soften the falloff to `1 − distance*0.18`.

### 1.3 Room is lit from the top of the frame — **needs rework**

**Spec.** In `p01_1` the ceiling above the wall is `rgb(160,38,6)` lum 62 and
the top-left corner is lum 21 — a near-black smoke dome framing the wall.

**Actual.** `landing-scene.tsx:88-103` — both radials centred at 20–22% of the
frame, i.e. *above* the wall. Top of frame composites to lum ~113.

**What's wrong.** The sky is the brightest thing above the wall, so the frame's
top reads as a sunrise rather than smoke-filled darkness. It roughly doubles the
ambient the sheets must beat — the second half of why the far sheets vanish.

**Fix.** Move both radials to sit behind the wall's mid-height (44–48%), drop
the room core to `#a8440f`, extend the vignette so the top 12% falls below lum 60.

### 1.4 Copy is a stock marketing stack over a cinematic still — **fundamentally wrong** *(disputed — see note)*

**Spec.** `p01_1` places copy into the frame as two short poster fragments in
the dark flanking zones, clear of the figure and plinth. No eyebrow, no
paragraph, no button row.

**Actual.** `hero.tsx:51-95` — dot eyebrow → `lg:text-6xl` h1 → body paragraph →
two `h-14` pills → scroll cue. At 1440×900 the block runs y≈356→804 (40–89% of
frame) and crosses the figure at x 684–756.

**Note.** The auditor's proposed fix — poster fragments, no CTA in frame — would
copy NMCo's *layout of copy*, and `p01_1` is another agency's advertisement.
Genesis's hook is fixed by spec page 10 and is a full sentence, not a fragment.
**Downgraded to needs-rework**: keep the real copy and the CTA, but stop the
headline crossing the figure and give the scene more of the frame.

### 1.5 Fixed-px scene doesn't scale — **needs rework**

Wall geometry is fixed px (`radius 620`, `height 524`), so it is 59% of a 1440px
frame, 44% of 1920, 33% of a 2560 ultrawide, and on a phone the wall is cropped
out of existence. Drive from container units.

### 1.6 The water is a brown wash, not a mirror — **needs rework**

`p01_1`'s lower third has max `rgb(255,249,220)` lum 248 — near-white speculars,
with the five sheets legibly mirrored as vertical streaks. Ours
(`landing-scene.tsx:138-170`) tops out at `rgb(186 78 16 / 0.3)` with no mirror
image at all. Also: the 1px/7px hairline ripples will alias into moiré at
non-integer DPR.

### 1.7 Blocks and plinth have no volume — **needs rework**

10 axis-aligned rectangles with one inset highlight line. The reference has
dozens of true boxes with lit top faces and two shaded side faces over three or
four depth bands. The plinth is 13% of frame width against the reference's 31.5%.

---

## 2. Services + Portfolio — fundamentally wrong

### 2.1 The camera pan crops both faces and their inner scroll is dead — **fundamentally wrong**

**Actual.** `camera-pan.tsx:90` clamps the stage to `lg:h-dvh lg:overflow-hidden`;
Face at :114 is `lg:absolute lg:inset-0 lg:overflow-y-auto`. Services measures
~1000px at lg. Lenis intercepts the wheel, so the inner scroll never runs.

**What's wrong.** On a 1440×900 laptop, **two of the five disciplines the spec
names** — Branding & Design, Apps & Games — sit below the fold of a face that
cannot be scrolled.

**Fix.** Add `data-lenis-prevent` to the Face div, and re-compose both faces to
fit 100dvh.

### 2.2 The "minimal scroll section" does not scroll — **fundamentally wrong**

Spec page 12 says "[Add minimal Scroll section]". Track = 256+256+320+256 + gaps
= **1144px**; available width is the same to the pixel. `snap-x snap-mandatory`
is inert, `no-scrollbar` hides a scrollbar that never appears, and `-mr-10`
advertises bleed that isn't there.

### 2.3 Services is a feature grid with a 2.5° tilt — **needs rework**

`img-009` and `img-053` stage 4–5 cards at **±8–14°**, overlapping in z, at two
or three sizes with staggered offsets. `services.tsx:55` is
`grid sm:grid-cols-2 lg:grid-cols-3`, all cards forced `h-full`, rotation
`±2.2–2.6°` — small enough to read as a rendering artefact. This is the exact
template look the client is objecting to.

### 2.4 The spotlight is ambient haze, not a source — **needs rework**

`img-009` is lit by one narrow hard-edged near-white shaft raking in at 25–35°
off vertical. Ours is a cone **59% of the section wide**, blurred 18px, down to
10% alpha where the cards sit. No readable lit/unlit boundary, no cast shadows.

### 2.5 Camera pan reads as a card flip — **needs rework**

Two coplanar faces with `backface-visibility: hidden` is the CSS flip-card
recipe: at 90° both faces are edge-on and the middle of the transition is an
empty black frame. Nothing translates in Z, so it is a page turning over, not a
camera moving through a room. "The slides move" is unimplemented.

---

## 3. Case Studies + Journey — fundamentally wrong

### 3.1 Case Studies uses the wrong archetype entirely — **fundamentally wrong**

**Spec.** Spec page 13 is Case Studies, and both design images on it
(`p13_1` = `img-025`, `p13_2` = `img-026`) are **movie-poster stages**: tall 2:3
posters on a dark ground, centre card enlarged, flankers dimmed and cropped by
the frame, the whole rail inside a crimson bloom.

**Actual.** `case-studies.tsx:33` renders `grid sm:grid-cols-2` — a 2×2 grid of
rounded glass rectangles. It never imports `PosterCard`, which exists and is
built for exactly this.

**What's wrong.** The section the spec gives the most cinematic treatment is
rendered as the most generic layout on the web, identical in silhouette to the
services grid, the process grid and the footer stat bar.

### 3.2 The Journey newspaper is invisible — **fundamentally wrong**

**Spec.** `p15_0`: the broadsheet is the **brightest object in the frame**,
near-white against a cold blue-grey room, in a hard elliptical pool of light.

**Actual.** `journey.tsx:86-88` paints it `rgb(232 238 248 / 0.10)` over
`#08080a` — brightest pixel composites to about `#1e2026`, **8% lighter than the
page**.

**What's wrong.** There is no newspaper on screen. There is a barely-perceptible
lighter rectangle with a faint cross on it. The whole conceit is stated in the
source comments and delivered nowhere in pixels.

### 3.3 The timeline bears no resemblance to `img-004` — **fundamentally wrong**

`img-004` is a thick glowing spline bending around a ~64px circular glass node,
with a tick ruler and date pills joined by leader lines. Ours
(`animated-timeline.tsx:70`) is `h-full w-px bg-white/10` with `to-transparent`
at the end — **so even at scroll progress 1 the bottom third is transparent by
construction** — and 10px dots.

### 3.4 "Numbers increasing animation" is one small number in an empty bar — **needs rework**

Three of four figures are `TODO`, so `StatRow` leaves one, and `grid-cols-1`
renders a single 24px number hugging the left edge of a 1024px glass bar. The
degradation logic is right; the chassis it degrades into is wrong.

---

## 4. Creative Process + AI Content — fundamentally wrong

### 4.1 The display type is invisible, so nothing is occluded — **fundamentally wrong**

**Spec.** In `p27_1` "Creative Flow" is the **largest thing in the frame** —
pure white (`253,254,255`) at ~12:1 against the red ground, partly covered by
the cards. That occlusion is the entire reason the composition reads as layered.

**Actual.** `creative-process.tsx:90-96` — one word at `text-white/[0.09]`.
Against the ground the section paints there, glyphs land at `rgb(83,29,37)` —
about **1.2:1**.

**What's wrong.** At 1.2:1 nothing is occluded because nothing is visible. The
cards float on an empty red rectangle with a faint smudge behind them.

### 4.2 Scatter geometry is a grid that slipped — **fundamentally wrong**

**Spec.** `p27_1`: five **portrait** cards (~24% wide, 58% of canvas height)
overlapping by **30–40% of a card width**, all tilted the *same* direction
(−10° to −14°).

**Actual.** `SCATTER` gives x-spans with overlaps of **11px, 0px, 11px** — 0–4%
of a card width — and tilts *alternate* −9/−5/+4/+8. Cards are wider than tall.

**What's wrong.** Four evenly-spaced, landscape cards in a row that barely
touch, tilted alternately, with clearance on all four sides. Exactly what the
file's own header comment says it was rebuilt to stop being. *(This one is
mine, from the last session — the tilt magnitude was right and everything else
about the geometry was not.)*

### 4.3 Cards are lighter than the ground they sit on — **needs rework**

`p27_1`'s cards are **dark slabs on a bright ground** — sampled fills `(3,3,3)`,
`(15,6,4)`, `(80,32,2)` against a red peaking at `(162,23,4)`. Ours adds
`rgb(255 45 63/0.14)` + `rgb(255 255 255/0.04)` on top of `.glass`'s another 5%
white. Net: a *lightening* wash. The section pays for `backdrop-filter` on four
elements for zero visual return.

### 4.4 AI Content is teal/green/violet inside a crimson brand — **fundamentally wrong**

`ai-content.tsx:36` sets `tone="teal"`, painting the section aurora
`rgb(45 212 191 / 0.14)`; all five avatar frames are `rgb(45 212 191 / 0.28)`;
`ToolsStack` uses `#4ade80` and `#a78bfa`, which are not tokens at all. One
section shows five accent colours and none is the brand's primary.

### 4.5 The avatar arc is a small centred cluster — **needs rework**

`img-033` is a continuous curved wall bleeding off **both** viewport edges,
panels nearly flush, all at full brightness. Ours is five 160×256 frames totalling
880px inside a 1104px container, with the outer frames faded to 0.45 opacity —
the generic 3D-carousel look.

### 4.6 Tools-stack curves don't meet their labels — **needs rework**

Emitter dots land at y = 49.8…448.0px; labels are positioned by
`justify-between` with `py-[9%]`, so the first and last curves start ~46px from
the label they emit from. All six curves converge ~150px *inside* the
destination wordmark.

---

## 5–9. Audited at code level only

Shallower than the above. Flagged rather than fully diagnosed.

- **Influencer** — rebuilt to `p07_0` last session; measured to match
  (feature card 27.8% vs 27.6%, 60fps). **Branding & Design** is a 2-column grid
  of capability chips at `tone="neutral"` — another grid, generic. *needs rework*
- **Client Logos + Testimonials** — `watch-cluster.tsx:22-25` does scale by
  distance from centre and is draggable, which is what spec pages 4 and 27 ask
  for. **Structurally passes**; inherits the weak glass.
- **Blog / Insider / Footer** — footer does use `glass glass-strong glass-lit`
  and `social-stars.tsx:19` is a real 8-point star clip-path, so both spec notes
  are implemented. Both inherit the weak glass. `insider-teaser` is teal.
- **`/our-work`** — rebuilt to `p07_1` with the mockup's ten real thumbnails.
  Closest section on the site to its reference.
- **Thin pages** — measured, not diagnosed: `/careers` 96.0% of pixels in
  shadow, `/influencer-campaigns` 99.1%, `/content-creation` 93.4%, `/creator`
  87.8%, all with **zero images**. Essentially blank screens. No Genesis mockup
  exists for any of them.

---

## Fix order

Foundational first — every section inherits it, so fixing once is cheaper than
fixing the same problem section by section.

1. `--glass-fill` 5% → 7.5%, `--glass-fill-strong` 8% → 12% *(0.1)*
2. Nav onto the tokens *(0.2)*
3. `GhostType` 3.5% → 12%, allow wrapping *(0.3)*
4. `placeholderArt` hue → brand arc *(0.4)*
5. Teal → crimson in `ai-content`, `insider-teaser` *(0.5, 4.4)*
6. Hero: invert wall curvature, hue-preserving sheet falloff, move the light
   behind the wall *(1.1, 1.2, 1.3)*
7. Case Studies onto `PosterCard` *(3.1)*
8. Journey: raise the sheet to paper values, thicken and light the rail *(3.2, 3.3)*
9. Process: display type to full strength, portrait cards with real overlap,
   dark fills *(4.1, 4.2, 4.3)*
10. Services: scattered arc at ±8–14°, narrow raked beam *(2.3, 2.4)*
11. Camera pan: restore inner scroll *(2.1)*
12. AI content: crimson palette, full-bleed avatar wall *(4.4, 4.5)*
13. Portfolio: make the scroll real *(2.2)*
14. `StatRow` solo case *(3.4)*
15. Tools-stack label alignment *(4.6)*

## Blocked on the client

| Item | Owner | Blocks |
| --- | --- | --- |
| Hero reel — muted loop + poster (spec p10) | Genesis | 1.x |
| AI avatar stills for Adi, Diya, Ivaanat, Shivam, Tanvi | Genesis | 4.5 |
| Case-study headlines and result figures ×4 | Genesis | 3.1 |
| Journey milestone dates and descriptions ×5 | Genesis | 3.2 |
| Real testimonial quotes ×12 | Genesis | testimonials |
| Client logo files (spec p17 "Ask tanvi") | Tanvi | client logos |
| Content thumbnails / reels beyond the 10 interim | Genesis | `/our-work` |
| Copy + direction for the four thin pages | Genesis | 9 |
| Real brand typefaces (Geist/Instrument Serif are stand-ins) | Genesis | 0.6 |
| Real logo file (`genesis-mark.tsx` is reconstructed) | Genesis | global |
| Confirm crimson as primary | Gaurav | everything |

---

## Resolution

Every finding above at **fundamentally wrong** or **needs rework** has been
addressed, across two passes. The commits carry the before/after measurements;
`PROGRESS.md` summarises them.

Two things remain open, both stated rather than quietly dropped:

1. **Hero warmth and saturation** still trail the reference (+132 vs +167,
   82% vs 93%). The haze layer was tested as the cause and moved saturation by
   0.0, so that change was reverted. The cause is not yet identified.
2. **The camera turn has never been verified in motion.** Lenis owns the
   scroll position, so scripted scrolling cannot scrub it. The initial state and
   both mechanisms are confirmed; the feel needs a human scroll.

Everything in **Blocked on the client** is unchanged — no amount of code moves
those.
