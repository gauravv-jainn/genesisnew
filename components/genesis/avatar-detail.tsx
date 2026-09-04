import Link from "next/link";

import { GlassButton } from "@/components/genesis/glass-button";
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
        <div className="relative aspect-[3/4] w-full sm:aspect-[16/10]">
          {/* TODO(assets): the real portrait replaces this ground. */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, rgb(${tint} / 0.4) 0%, rgb(14 14 18 / 0.97) 62%), radial-gradient(70% 50% at 50% 18%, rgb(255 255 255 / 0.14), transparent 72%)`,
            }}
          />
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
