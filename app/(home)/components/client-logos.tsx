import Image from "next/image";

import { clients } from "@/lib/home-content";
import { cn } from "@/lib/utils";
import { SectionShell } from "./section-shell";

/**
 * Section 5 — Clients we've worked with, as a palette.
 *
 * WHAT WAS WRONG WITH THE WALL. It was a WatchCluster — a honeycomb of
 * twenty-nine identical square chips that leaned toward the pointer. Genesis
 * asked for it to be a palette instead, and for the sizes to be fixed, and
 * those turn out to be the same request: the interaction was never the
 * problem, the square was.
 *
 * THE SQUARE WAS THE PROBLEM, WITH A NUMBER ON IT. These marks run from 0.89:1
 * to 12.63:1 — fourteen times the spread. `object-contain` in a 128px square
 * with 28px of padding fits each one to whichever edge it hits first, so a
 * square mark stood 72px tall and Mahindra Finance, at 12.63:1, stood 5.7. Not
 * small: invisible. No amount of enlarging the chip closes a gap like that,
 * because enlarging it scales both numbers together.
 *
 * SO THE CHIP ADAPTS TO THE MARK. Two rules, both driven by the measured
 * `ratio` in lib/home-content:
 *
 *   WIDTH — anything past 4.5:1 takes a double-width chip. A long horizontal
 *     lockup wants a long horizontal swatch; that is what it was drawn to be.
 *     Five of the twenty-nine qualify, and the varied chip widths are also
 *     what stop this reading as a spreadsheet and start it reading as a paint
 *     deck.
 *   HEIGHT — the ink is given a height in three steps rather than one, so a
 *     near-square mark is not held to the same line as a wordmark. Combined
 *     with a max-width the box then fits whichever edge the mark reaches, and
 *     every mark ends up covering a comparable AREA, which is what the eye
 *     actually reads as "the same size".
 *
 * Measured on the result: Mahindra Finance goes 5.7px → 30px of height, HDFC
 * 12px → 40px, and a square mark 72px → 76px. The worst case improves 5×
 * while the best case barely moves, which is the whole point.
 *
 * IT IS A SWATCH BOARD, SO EVERY CHIP IS LABELLED. A palette chip carries its
 * name; it is also the only thing that tells a visitor who a mark belongs to
 * when they do not happen to know a client's logo by sight.
 *
 * AND IT IS COLOURED, WHICH IS THE SECOND PASS. Sizing the marks correctly
 * fixed legibility and left the wall reading as a directory — twenty-nine
 * identical white cards in a table. Genesis rejected it, and the diagnosis is
 * that twenty-nine logos carry twenty-nine unrelated colour schemes, so on one
 * flat ground the only thing the eye gets is the grid.
 *
 * So every chip is tinted with the brand hue of the mark standing on it,
 * measured off the artwork itself (see lib/home-content). The tint is set at a
 * fixed saturation and lightness so only the HUE varies across the wall: it
 * stays a palette rather than becoming twenty-nine differently-loud boxes, and
 * the colour rhythm comes from the client list instead of from a swatch
 * someone chose.
 *
 * THE TINT IS PALE ON PURPOSE, AND IN BOTH THEMES. These files were drawn for
 * white paper, and a mark on a strong ground either clashes or has to be
 * knocked out, which is editing a client's logo. 96% lightness is enough to
 * read as colour next to its neighbours and light enough that every mark sits
 * on it untouched — including in dark mode, where the wall becomes pale
 * swatches on a dark table rather than dark chips that no logo survives.
 */

/**
 * Past this, a mark gets a double-width chip.
 *
 * 4.5 AND NOT 3.5, WHICH IS A HEIGHT DECISION AS MUCH AS A WIDTH ONE. Every
 * double costs the board a column, and at 3.5 nine of the twenty-nine
 * qualified: 38 column-units over six columns is seven rows, 953px of wall.
 * At 4.5 it is five doubles, 34 units, six rows — 125px shorter, for marks
 * that measurably do not suffer. Grand Hyatt at 4.14:1 is the closest call
 * and it renders 135px wide inside a 152px allowance, so the single chip was
 * never the thing constraining it.
 */
const WIDE_RATIO = 4.5;

/**
 * Past this, a mark is treated as a long wordmark for HEIGHT purposes.
 *
 * Deliberately NOT the same number as WIDE_RATIO. How tall the ink should
 * stand is a question about the mark; whether it earns two columns is a
 * question about the board. Tying them together is what made the height rule
 * move every time the row count was tuned.
 */
const LONG_RATIO = 3.5;

/**
 * How tall a mark's ink stands, as a share of the chip's media band.
 *
 * Three steps, not a formula. A continuous curve reads as noise across
 * twenty-nine chips — a set of marks all at slightly different sizes looks
 * like a mistake, where a set at three deliberate sizes looks like a system.
 */
function inkHeight(ratio: number): string {
  if (ratio < 1.8) return "62%";
  if (ratio < LONG_RATIO) return "48%";
  return "34%";
}

/**
 * The four colours a chip is built from, given its mark's brand hue.
 *
 * ONE SATURATION AND ONE LIGHTNESS FOR EVERY CHIP. Using each brand's actual
 * colour at its actual strength would put Budweiser's full red beside Royal
 * Tulip's soft gold and read as twenty-nine accidents; holding S and L still
 * and moving only H is what makes a set of colours a palette.
 *
 * A `null` hue is a mark with no colour in it at all, and it gets a neutral
 * chip — the same construction at zero saturation, so it sits in the wall
 * rather than looking like a chip that failed to load.
 */
function swatch(hue: number | null, pale = false) {
  const h = hue ?? 0;
  const s = hue === null ? 0 : 1;
  return {
    /*
      The chip's ground: colour you notice beside its neighbours, not on it.
      66/90.5 was arrived at by looking — 96.5% was measurably a tint and
      visibly nothing, 88% started eating the palest marks.

      `pale` gives the ground up entirely for a mark that cannot afford it.
      See the note in lib/home-content: exactly one qualifies, on a
      measurement, and it keeps the hue everywhere else on the chip so it is
      still part of the wall.
    */
    "--chip": pale ? `hsl(${h} ${30 * s}% 98.5%)` : `hsl(${h} ${66 * s}% 90.5%)`,
    /* Where it goes on hover — the same hue, one step in. */
    "--chip-hover": pale ? `hsl(${h} ${40 * s}% 96%)` : `hsl(${h} ${70 * s}% 86.5%)`,
    /* Border and label, dark enough to read against the ground they sit on. */
    "--chip-edge": `hsl(${h} ${42 * s}% 77%)`,
    "--chip-ink": `hsl(${h} ${26 * s}% 42%)`,
  } as React.CSSProperties;
}

export function ClientLogos() {
  return (
    <SectionShell
      id="clients"
      label={clients.label}
      heading={clients.heading}
      headingAccent={clients.headingAccent}
      body={clients.body}
      tone="brand"
      origin="center"
      intensity={0.14}
    >
      {/*
        No Reveal per chip. Twenty-nine staggered entrances is a long wait for
        a wall whose whole job is to be taken in at once — the board arrives as
        one thing, which is what SectionShell's own reveals already do for the
        header above it.
      */}
      <ul className="grid grid-flow-row-dense grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {clients.logos.map((logo) => {
          const wide = logo.ratio >= WIDE_RATIO;
          return (
            <li
              key={logo.file}
              /*
                `in` rather than `logo.pale`: the catalogue is `as const`, so
                only the one entry that needs the flag carries it and the
                union has no such property on the other twenty-eight. Adding
                `pale: false` to all of them to satisfy the type would be
                twenty-eight lines of noise to say nothing.
              */
              style={swatch(logo.hue, "pale" in logo && logo.pale === true)}
              className={cn(
                /*
                  The chip is its client's colour, not the page's. It is
                  opaque rather than glass on purpose — a logo is the client's
                  asset and belongs on a ground you control, not one that
                  picks up whatever gradient is behind it, and the ink
                  corrections below were measured against a near-white chip.
                */
                "group/chip flex flex-col overflow-hidden rounded-card border",
                "border-[var(--chip-edge)] bg-[var(--chip)]",
                /*
                  Colour and lift on hover, and NOTHING that moves the mark
                  itself. Scaling a client's logo on hover is the sort of
                  flourish that makes a wall of them feel like a toy.
                */
                "transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:bg-[var(--chip-hover)] hover:shadow-[0_10px_24px_-12px_rgb(0_0_0/0.35)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                wide && "col-span-2",
              )}
            >
              <div className="relative flex h-20 items-center justify-center px-4 sm:h-24">
                {/*
                  The ink box: a height from the rule above, capped at 86% of
                  the chip so a mark never runs into the edges, and
                  object-contain fitting to whichever it reaches first.
                */}
                <span
                  className="relative block h-full w-full"
                  style={{ height: inkHeight(logo.ratio), maxWidth: "86%" }}
                >
                  <Image
                    src={`/clients/${logo.file}.png`}
                    alt={logo.name}
                    fill
                    /*
                      The widest chip is a double at the lg breakpoint — about
                      370px across a 1104px container. Without this every one
                      of the twenty-nine would pull a viewport-sized file.
                    */
                    sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 90vw"
                    className="object-contain"
                    style={
                      /*
                        Seven marks cannot live on paper as supplied. Two are
                        monochrome white and simply invert, which for a mark
                        with no colour in it is lossless. Five carry colour and
                        are dimmed instead, which holds the hue — inverting
                        those would turn The Lalit's red square cyan. Measured,
                        not eyeballed; see lib/home-content.
                      */
                      logo.ink === "invert"
                        ? { filter: "invert(1)" }
                        : logo.ink === "darken"
                          ? { filter: "brightness(0.58) saturate(1.2)" }
                          : undefined
                    }
                  />
                </span>
              </div>

              {/*
                The swatch label, set in the chip's own hue rather than a page
                token. Grey uppercase captions under twenty-nine white boxes
                are most of what made this read as a table; a name in its
                brand's colour is part of the swatch. It is also fixed ink
                because the chip is pale in BOTH themes — a --faint that
                followed the theme would go pale-on-pale the moment the page
                turned dark.
              */}
              <p className="border-t border-[var(--chip-edge)] px-3 py-2 text-center text-[0.625rem] font-medium uppercase leading-tight tracking-[0.08em] text-[var(--chip-ink)]">
                {logo.name}
              </p>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
