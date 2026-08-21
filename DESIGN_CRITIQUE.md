# Design critique — Genesis Media

Reviewed 2026-08-21, on the rendered DOM at 1440×900.

**How this was judged, and what that limits.** Playwright is not installed and
there is no browser automation. The in-app browser pane returns black frames.
And homepage sections cannot be screenshotted headlessly at all — the hero is
`min-h-dvh`, so a headless viewport always equals the hero's height and can
never reach a section 5,000px down. So this critique reads **computed styles on
the live DOM** — what the visitor's browser actually resolved, not what the
components say. That is the right input for type, spacing, colour, elevation,
radius and motion, which is most of what follows. It is *not* a substitute for
looking, and the composition notes are correspondingly weaker than the
systemic ones. Where a judgement needs an eye, it says so.

---

## The verdict

Structurally this is a long way from an AI template. The scenes are real — a
concave document wall built from measured reference samples, a magnetic paper
vortex, a wireframe creator constellation. Nobody generates those by accident.

But the **system underneath them is not designed**, and that is what makes it
read as unfinished. Four numbers:

| | measured | what a designed system looks like |
| --- | --- | --- |
| Distinct type steps | **35** | 7–9 |
| Distinct spacing values | **25** | 8–10 |
| Distinct corner radii | **10** | 3–4 |
| Real elevation tiers | **1** | 3–4 |

Every one of those is the signature of decisions made per-call-site instead of
once. The scenes are crafted; the connective tissue between them is not.

---

## 1. Typography — no scale exists

**35 distinct size/weight pairs on one page.** Between 8px and 16px, every
single integer is in use: 8, 9, 10, 11, 12, 13, 14, 15, 16. That is not a
scale, that is whatever felt right at each call site.

Then there is a hole. Headings resolve to:

```
80px w300   60px w600   48px w600   36px w600   20px w600   18px w600   15px w600
```

Nothing between **20px and 36px**. So a section heading and a card heading are
either 36 apart or nearly touching, and there is no step available for the
level in between — which is why card titles all collapse to the same weight and
size and no card ever establishes hierarchy inside itself.

Worse, the same size renders at different rhythms:

- `60px` appears at line-height **61.2px** *and* **63px**
- `18px` appears at line-height **28px** *and* **24.75px**

That is drift, not intent. Nobody chose 24.75.

**Fix.** One scale, eight steps, defined once in `@theme` and used everywhere:

| Token | Size / line-height / tracking | For |
| --- | --- | --- |
| `display` | 76px / 0.92 / −0.03em | Hero and section display type |
| `h1` | 56px / 0.98 / −0.025em | Page titles |
| `h2` | 40px / 1.05 / −0.02em | Section headings |
| `h3` | 28px / 1.15 / −0.015em | **The missing step** — card titles |
| `lead` | 19px / 1.55 / −0.005em | Standfirsts |
| `body` | 16px / 1.6 / 0 | Running text |
| `small` | 14px / 1.5 / 0 | Captions, meta |
| `micro` | 11px / 1 / 0.28em | The letterspaced caps label |

Weights collapse to three: 300 for display, 500 for UI, 600 for headings. Kill
9, 10, 12, 13, 15 outright.

---

## 2. Spacing — 25 values, near-continuous

In use: `2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 112,
128, 160`. Six of those (6, 10, 14, 28, 56, 112) are off any 4-based grid, and
they exist because someone reached for `gap-2.5` or `mt-7` in the moment.

The deeper problem is that this makes proximity meaningless. Related things
should sit closer than unrelated things, and with 25 values available there is
no consistent difference between "these belong together" and "these do not".

**Fix.** A 4-based scale, nine steps, nothing else:

```
4  8  12  16  24  32  48  64  96  128  160
```

with a rule attached: **within a component** use 4–16; **between components in
a group** use 24–32; **between groups** use 48–64; **between sections** use
96–160. Then the spacing itself carries the grouping.

---

## 3. Elevation and depth — this is the flat one

There is no elevation system. The tokens exist and are not used:

| Token | Value | Uses |
| --- | --- | --- |
| `void` | `#08080a` | 14 |
| `ink` | `#0a0a0b` | **2** |
| `elevated` | `#131316` | **2** |
| `raised` | `#1c1a20` | **0** |

`void` and `ink` differ by **two luminance levels** — invisible on any display.
So the entire site is one black with white overlays on top, which is exactly
the "flat dark theme" failure: no sense that anything sits above anything else.

And there is **one real box-shadow** across the whole page — the `.glass`
shadow, on 88 elements. Everything is at the same depth because everything
shares one shadow.

**Fix.** A named four-tier ladder, with the surface tone and the shadow moving
together:

| Tier | Surface | Shadow | Use |
| --- | --- | --- | --- |
| `base` | `#08080a` | none | page ground |
| `raised` | `#111014` | `0 2px 8px -2px rgb(0 0 0/0.6)` | inline chips, pills |
| `panel` | `#17161c` | `0 12px 32px -8px rgb(0 0 0/0.7)` | cards |
| `float` | `#1e1c24` | `0 28px 64px -16px rgb(0 0 0/0.85)` | modals, focused cards |

The point is that a card must be a *lighter surface*, not merely a bordered
region of the same black.

---

## 4. Glass — fixed, but single-tier

The fill was corrected earlier (+3.4 → +10.8 luminance lift, against Genesis's
own artwork at +18.6), so it no longer reads as a flat grey box. But there is
still exactly **one** glass treatment: one blur, one border, one shadow.

Real glass has near and far. A nav pinned over a scene and a card lying in the
page should not share a blur radius. **Fix:** `.glass` at 20px blur for
in-page surfaces; `.glass-strong` at 40px reserved for overlays; and a `.glass`
variant with no border for surfaces that sit on a busy scene, where the
hairline is the thing that makes it look pasted on.

---

## 5. Motion — one animation, 51 times

**51 `Reveal`s across 16 sections. Every single one uses the default 0.6s
duration. 14 of 16 use the default `up` direction.**

This is the definition of generic scroll motion: one fade-and-slide applied
everywhere regardless of what is moving or why. A poster rail, a wall of
documents, a timeline and a footer all arrive the same way.

**Fix.** Give each section a reason:

- **Editorial blocks** (headings, copy) — 0.5s, 16px rise. Quick, gets out of
  the way.
- **Cards in a group** — 0.6s with a 60ms stagger, and they should arrive on
  the axis they are arranged on: the scattered process cards should settle
  *into* their rotation, not slide up into it.
- **Scenes** (document wall, vortex, constellation) — 1.1s, no translation at
  all. Something that large moving 24px reads as a hitch; it should resolve in
  place.
- **Figures and counters** — no entrance. They already animate by counting.

---

## 6. Colour — one hardcoded accent belongs to no palette

`#c5ff2e` — **lime green — on 10 elements** in the Services section, as the
pushpin heads, plus `#8fbf22` for their shadows. Hardcoded hex, not a token.

It comes from `img-009`, where the pushpins genuinely are lime, so it was a
deliberate reading of the reference. But it is the only green on a
black-and-crimson site and it is the brightest thing in that section.

I should also own this: I reported "0 non-brand accents" after the last pass.
That grep only checked teal and violet hex strings. It missed ten lime
elements. The check was wrong, not the site.

**Fix.** Either promote it to a real token with a stated role, or bring the
pins to crimson. Given the palette, crimson.

Also present: `rgb(255, 0, 0)` on 2 elements — pure red, not the brand's
`#ff2d3f`.

---

## 7. Corner radius — 10 values

In use: `2, 5, 10, 14, 18, 22, 24, 28, 32` and pill. Nothing connects them.

**Fix.** Four: `4` (inputs, chips), `12` (cards), `24` (panels), `pill`
(buttons, badges). The `2px` on the newspaper sheet stays — that one is
representational, it is paper.

---

## 8. Dead code in the component layer

`components/ui/button.tsx` exists and is **imported by nothing**. The site uses
its own `GlassButton` throughout, which is the right call — but leaving an
unused shadcn default in the tree is the kind of thing a reviewer reads as "not
finished". Delete it.

---

## 9. Composition — the weakest part of this critique

I cannot see these sections, so I am flagging rather than concluding.

From structure alone: **`SectionShell` centres its heading block and constrains
everything to `max-w-6xl`**, and eleven sections use it. That is the boxed-in,
symmetric arrangement the brief warns about. The sections that break out —
hero, influencer, creative process, services — do so because they were rebuilt
against specific references, not because the shell offers an asymmetric option.

**Fix.** Give `SectionShell` an `align="split"` mode: heading left at
`max-w-xl`, standfirst right at `max-w-sm`, on a 12-column grid rather than a
centred column. Several sections already hand-roll exactly this — it should be
the shell's job.

---

## Fix order

1. Type scale — 35 steps → 8, plus the missing 28px step
2. Spacing scale — 25 values → 9, with the proximity rule
3. Elevation ladder — 1 tier → 4, surfaces and shadows together
4. Radius scale — 10 → 4
5. Lime → crimson; kill `rgb(255,0,0)`
6. Motion personality — per-section timing, scenes resolve in place
7. Glass near/far tiers
8. Delete the dead shadcn button
9. `SectionShell` split alignment

1–5 are mechanical and systemic: they fix the same symptom in every section at
once. 6–9 are per-section work.

---

## What no amount of code fixes

- **Real brand typefaces.** Geist and Instrument Serif are stand-ins. The type
  scale above will hold when they are swapped, but the *character* of the
  display type — the thing that makes a headline look designed rather than
  large — is the typeface, and that is a brand decision.
- **Exact brand hex values.** Crimson `#ff2d3f` was sampled from Genesis's own
  artwork, which is good evidence but not a spec.
- **Photography.** Everything in `public/` is a still cropped from a design
  comp.
