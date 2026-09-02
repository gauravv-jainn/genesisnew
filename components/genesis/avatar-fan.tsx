import { cn } from "@/lib/utils";

/**
 * The AI avatar roster, dealt as a hand of cards.
 *
 * THE DECK'S OWN BOARD. The AI Lab page fans seven portraits across the
 * bottom of the frame, overlapping, tipping further as they run out to the
 * edges, with one held upright in the middle and lit. It reads as a roster
 * being shown to you — which is what a roster of avatars is.
 *
 * WHAT THIS REPLACED. A five-panel rotateY wall at 1200px perspective. That
 * was built from a different reference (a curved video wall) and it had two
 * problems here: rotateY foreshortens a face until the outer panels are
 * unreadable slivers, and it made five avatars look like one continuous
 * screen rather than five separate people. A flat fan keeps every face at
 * full width and every card visibly its own object.
 *
 * THE GEOMETRY IS A PIVOT, NOT AN OFFSET. The first attempt rotated each
 * card about its own centre and then pushed it down by the square of its
 * distance from the middle. That is the arithmetic of an arc and it produced
 * the opposite of one — an arch, curving UP at the ends — because rotating
 * about the centre swings the top of an outer card toward the middle while
 * the drop moves the whole card down. It also broke the layout: transforms do
 * not affect flow, so the pushed-down cards fell straight out of the bottom
 * of their own container and were clipped.
 *
 * A hand of cards fans from a point BELOW the hand. So every card sits in the
 * same place and the only transform is a rotation about an origin four card
 * heights down. The spread, the descent toward the edges and the overlap all
 * fall out of that one number — there is nothing left to tune against itself,
 * and the container's height is a fixed multiple of a card's rather than
 * something that has to be kept in sync with a drop formula.
 *
 * NO OPACITY RAMP, deliberately, and this is the second time it has been
 * written down: the board keeps every card at full brightness, and the
 * outermost one is as vivid as the centre. Fading the flanks produces the
 * generic 3D-carousel look the board is not.
 */

/** Placeholder grounds, one per position, running the deck's spectrum warm to
 *  cool so the fan is not seven of the same rectangle. Replaced wholesale by
 *  the real portraits. */
const PLACEHOLDER = [
  "122 60 255",
  "160 74 220",
  "214 90 175",
  "247 113 158",
  "255 143 120",
  "255 160 82",
  "255 200 90",
];

type Avatar = {
  id: string;
  name: string;
  role?: string | undefined;
};

/**
 * Degrees between neighbouring cards, and how far below a card the pivot
 * sits as a percentage of its height.
 *
 * THESE TWO ARE ONE DECISION. Spread is the product of them — pivot distance
 * times angle — so a near pivot with a big angle and a far pivot with a small
 * one cover the same width and look nothing alike. The near one tips the
 * outer cards hard and, because the bottom of a card is closer to a pivot
 * beneath it than the top is, jams their bottom edges together. That is
 * exactly where the names are, and at 400%/10deg the roles on the flanking
 * cards were being eaten by their neighbours.
 *
 * 650%/6.6deg covers the same width with a card's bottom edge at 85% of its
 * top edge's radius instead of 75%, which leaves the overlap at the name line
 * around 15% rather than 27% — enough to read every role, still enough to
 * read as a hand of cards rather than a row of them.
 */
const STEP = 6.6;
const PIVOT = "50% 650%";

export function AvatarFan({
  avatars,
  className,
}: {
  avatars: readonly Avatar[];
  className?: string;
}) {
  // The middle card, whichever way the roster is ordered.
  const centre = (avatars.length - 1) / 2;

  return (
    /*
      Height is the card's 4:3 height, plus the extra a rotated rectangle
      needs for its corners, plus the distance the outermost pair swings down.
      For a 3:4 card at 19.8 degrees that comes to just over twice the card's
      WIDTH, which is the unit the card is sized in — so the box is expressed
      as a multiple of that and stays right at every viewport.

      It has to be generous: the bleed wrapper around this is overflow-hidden
      to keep w-screen from widening the page, so anything that overruns this
      box is not merely overlapping, it is cut off. At 1.82 it was slicing the
      bottom off the outer two cards' names.
    */
    <div
      className={cn(
        "relative h-[calc(clamp(7.5rem,14vw,13rem)*2.2)] w-full",
        className,
      )}
    >
      {avatars.map((avatar, index) => {
        const offset = index - centre;
        const distance = Math.abs(offset);
        const isCentre = distance < 0.5;

        return (
          <div
            key={avatar.id}
            className="absolute inset-x-0 top-0 flex justify-center"
            style={{
              // Nearer the middle sits on top, so the fan overlaps outward
              // from the card being presented.
              zIndex: Math.round((avatars.length - distance) * 10),
              transformOrigin: PIVOT,
              transform: `rotate(${(offset * STEP).toFixed(2)}deg)`,
            }}
          >
            <figure
              className={cn(
                "relative aspect-[3/4] w-[clamp(7.5rem,14vw,13rem)] overflow-hidden rounded-[1.25rem] border",
                // The upright card is the only one carrying a lift, so the
                // eye is told where to start.
                isCentre
                  ? "border-white/25 shadow-[0_24px_70px_-20px_rgb(0_0_0/0.9),0_0_44px_-12px_rgb(255_212_0/0.28)]"
                  : "border-white/10 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.9)]",
              )}
              style={{
                /* TODO(assets): the real portrait replaces this ground. */
                background: `linear-gradient(160deg, rgb(${PLACEHOLDER[index % PLACEHOLDER.length]} / 0.34) 0%, rgb(14 14 18 / 0.97) 58%), radial-gradient(78% 52% at 50% 16%, rgb(255 255 255 / 0.13), transparent 72%)`,
              }}
            >
              {/*
                The scrim. On the board the names are burned into the lower
                third of each photograph, and white type straight onto a
                portrait is a coin toss — this makes it a certainty.
              */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-3/5"
                style={{
                  background:
                    "linear-gradient(0deg, rgb(0 0 0 / 0.88) 0%, rgb(0 0 0 / 0.45) 46%, transparent 100%)",
                }}
              />

              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-center sm:p-4">
                <span className="block text-[clamp(0.95rem,1.9vw,1.6rem)] font-semibold uppercase leading-none tracking-tight text-white">
                  {avatar.name}
                </span>
                {avatar.role && (
                  <span className="mt-1.5 block text-[clamp(0.4rem,0.72vw,0.6rem)] font-medium uppercase leading-tight tracking-[0.14em] text-white/70">
                    {avatar.role}
                  </span>
                )}
              </figcaption>
            </figure>
          </div>
        );
      })}
    </div>
  );
}
