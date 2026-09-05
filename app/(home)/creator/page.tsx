import type { Metadata } from "next";

import { GenesisForm } from "@/components/genesis/genesis-form";
import { GenesisMark } from "@/components/genesis/genesis-mark";
import { Reveal } from "@/components/genesis/reveal";
import { SlideUp } from "@/components/genesis/slide-up";
import { creatorPage } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "For Creators",
  description: creatorPage.body,
};

/**
 * /creator — the roster form, and nothing else.
 *
 * WHAT THIS PAGE USED TO BE: an eyebrow, a headline, a corner note, four
 * pinned benefit cards, a second corner note, then a section shell with its
 * own label, its own heading, its own standfirst, and finally the form. Nine
 * blocks of persuasion in front of one thing to fill in.
 *
 * Genesis cut it to the mark and the form, and they are right about who is on
 * this page. A creator arrives here from a nav item that says "I'm a Creator"
 * — they have already decided. Everything between that decision and the first
 * field is the site talking to itself. The offer still exists in full inside
 * the form's own fields, which is where someone who wants the detail will
 * meet it.
 *
 * THE SPOTLIGHT IS GONE TOO. I kept it on the argument that it was lighting
 * rather than copy; Genesis looked at it and said no, and they are right about
 * what it was doing. A hard cone falling from the top-right landed across the
 * form itself — it lit the fields, tinted half of them warmer than the other
 * half, and put a diagonal edge through a panel somebody is trying to read and
 * type into. Drama behind a headline is one thing; drama over an input is a
 * filter over the thing the page exists for.
 */
export default function CreatorPage() {
  return (
    <SlideUp>
      <main className="relative isolate min-h-dvh overflow-hidden pb-32 pt-32 sm:pt-40">
        {/*
          ONE COLUMN, so the headline sits on the same left edge as the first
          field rather than floating over a form centred beneath it.
        */}
        <div className="relative z-[2] mx-auto w-full max-w-2xl px-6">
          <Reveal>
            {/*
              THE WORDMARK, NOT THE WORDS. The mark exists; setting the brand
              name in type on a page that uses the artwork everywhere else was
              the one place it was being redrawn by hand.

              It stays an h1, and the sr-only name is what a screen reader and
              a crawler read — so this is still a heading carrying the
              company's name, not a picture where a heading should be.

              `aspect-[8.8/1]`, not `w-auto`: GenesisMark holds two `fill`
              images, which are absolutely positioned and contribute no
              intrinsic size, so w-auto resolved to zero and the mark rendered
              0x40. The artwork's ratio has to be declared for the height to
              imply a width.
            */}
            <h1 className="flex flex-col gap-y-3 text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1">
              <span>{creatorPage.heading}</span>
              <span className="sr-only">Genesis Media</span>
              <GenesisMark
                aria-hidden
                className="h-[0.78em] w-auto shrink-0 aspect-[8.8/1]"
                sizes="(min-width: 640px) 384px, 80vw"
              />
            </h1>
          </Reveal>

          <Reveal delay={0.08} className="mt-12 sm:mt-14">
            {/*
              `influencer` rather than `creator`: same audience, the field set
              Genesis actually runs — platforms, rates, and the permission to
              pitch on someone's behalf, which is a thing you must be asked for
              rather than assumed.

              `compact` drops the form's own heading, because the h1 above is
              the page's one title now.
            */}
            <GenesisForm kind="influencer" source="/creator" compact />
          </Reveal>
        </div>
      </main>
    </SlideUp>
  );
}
