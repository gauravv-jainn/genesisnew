import Image from "next/image";
import Link from "next/link";

import { GlassButton } from "@/components/genesis/glass-button";
import { Media } from "@/components/genesis/media";
import { mediaUrl } from "@/lib/media-url";
import { isPending } from "@/lib/home-content";
import { avatars, AVATAR_TINT, type Avatar } from "@/lib/avatars";

/**
 * One AI avatar, rendered identically whether it arrived as a dialog over the
 * roster or as its own page.
 *
 * IT OMITS WHAT IS NOT WRITTEN. Bio, languages and use cases are Genesis's to
 * supply and every block disappears while its field is pending. What a
 * visitor sees today is the avatar, its name and the brand it fronts — all of
 * which are real — and the rest appears with no code change when the copy
 * lands.
 */
export function AvatarDetail({ avatar }: { avatar: Avatar }) {
  const index = Math.max(0, avatars.findIndex((a) => a.id === avatar.id));
  const tint = AVATAR_TINT[index % AVATAR_TINT.length];

  return (
    <article className="flex flex-col gap-8">
      <figure className="relative overflow-hidden rounded-panel border border-[var(--glass-border)] bg-ink">
        {/*
          HEIGHT, NOT ASPECT, AND IT IS TIED TO THE VIEWPORT.

          This was aspect-[3/4] rising to 16/10, which sounds modest until the
          panel is 848px wide — at which point 16/10 is 531px of placeholder
          gradient before the reader reaches the avatar's own name. Measured on
          a 1440x900 laptop the page came to 1084px against a 900px viewport,
          and the same block is what the modal has to scroll past.

          An aspect ratio cannot know how tall the screen is; that is the whole
          problem with using one for a hero. A clamp can: 14rem on the smallest
          screen, 38% of the viewport where there is room, never past 26rem. The
          same rule serves the page and the dialog, which is why it lives here
          rather than in either of them.
        */}
        <div className="relative h-[clamp(14rem,38vh,26rem)] w-full">
          {avatar.portrait ? (
            <>
              {/*
                Framed from the TOP, not the centre. The hero is a wide short
                band cut from a 9:16 portrait, so a centred crop takes the
                torso and loses the face — which is the one part of an avatar
                card that matters.
              */}
              <Image
                src={avatar.portrait}
                alt={`${avatar.name} — AI avatar`}
                fill
                priority
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover object-top"
              />
              {/* Keeps the name legible over whatever the photograph does. */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgb(0 0 0 / 0.85) 0%, rgb(0 0 0 / 0.35) 42%, transparent 72%)",
                }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, rgb(${tint} / 0.4) 0%, rgb(14 14 18 / 0.97) 62%), radial-gradient(70% 50% at 50% 18%, rgb(255 255 255 / 0.14), transparent 72%)`,
              }}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <span className="block text-h1 font-semibold uppercase leading-none tracking-tight text-white">
              {avatar.name}
            </span>
          </div>
        </div>
      </figure>

      <header className="flex flex-col gap-3">
        <span className="micro-label text-brand-ink">Genesis AI Labs</span>
        <h1 className="text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1">
          {avatar.name}
        </h1>
        {avatar.role && (
          <p className="text-lead leading-relaxed text-ash">{avatar.role}</p>
        )}
      </header>

      {!isPending(avatar.bio) && (
        <section className="flex flex-col gap-2 border-t border-[var(--glass-border)] pt-8">
          <h2 className="micro-label">About</h2>
          <p className="max-w-2xl text-body leading-relaxed text-ash">
            {avatar.bio}
          </p>
        </section>
      )}

      {avatar.languages.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="micro-label">Languages</h2>
          <ul className="flex flex-wrap gap-2">
            {avatar.languages.map((language) => (
              <li
                key={language}
                className="glass-chip rounded-full px-3 py-1.5 text-small text-bone"
              >
                {language}
              </li>
            ))}
          </ul>
        </section>
      )}

      {avatar.useCases.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="micro-label">Used for</h2>
          <ul className="flex flex-wrap gap-2">
            {avatar.useCases.map((useCase) => (
              <li
                key={useCase}
                className="glass-chip rounded-full px-3 py-1.5 text-small text-bone"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/*
        WHAT THIS AVATAR HAS BEEN USED TO MAKE — the samples Genesis asked the
        window to carry. Films first, then stills, both from lib/home-content.

        RESPONSIVE BY COLUMN COUNT, not by media query on each tile: one across
        on a phone, two from 640, three from 1024, so a sample is never smaller
        than about 150px on the narrowest screen the modal opens on. `sizes`
        follows the same breakpoints, which is the half that actually saves
        bytes — without it every tile fetches a viewport-wide file.

        The whole block disappears while both lists are empty, which is where
        they are today. It is the same rule the bio and the language chips
        follow: show what is real, print nothing where nothing is written.
      */}
      {(avatar.reel.length > 0 || avatar.stills.length > 0) && (
        <section className="flex flex-col gap-4 border-t border-[var(--glass-border)] pt-8">
          <h2 className="micro-label">Made with {avatar.name}</h2>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {avatar.reel.map((clip) => (
              <li key={clip}>
                <video
                  src={mediaUrl(clip)}
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  className="aspect-[9/13] w-full rounded-card border border-[var(--glass-border)] bg-ink object-cover"
                />
              </li>
            ))}

            {avatar.stills.map((still) => (
              <li key={still} className="relative">
                <Media
                  src={mediaUrl(still)}
                  alt={`${avatar.name} — sample still`}
                  aspect="portrait"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--glass-border)] pt-8">
        <GlassButton
          href="/#contact"
          quickContact={`avatar:${avatar.id}`}
          variant="brand"
          arrow
        >
          Build with this avatar
        </GlassButton>
        <Link
          href="/#ai-lab"
          className="rounded-full px-3 py-2 text-small text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
        >
          All avatars
        </Link>
      </footer>
    </article>
  );
}
