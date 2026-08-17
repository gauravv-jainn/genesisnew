import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, Sparkles, Target, Users } from "lucide-react";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { AnimatedTimeline } from "@/components/genesis/animated-timeline";
import { GenesisMark, GenesisStar } from "@/components/genesis/genesis-mark";
import { GlassButton } from "@/components/genesis/glass-button";
import { LogoMarquee } from "@/components/genesis/logo-marquee";
import { OrbitingCards } from "@/components/genesis/orbiting-cards";
import { PaperCard, PaperStack } from "@/components/genesis/paper-card";
import { PosterRail, type Poster } from "@/components/genesis/poster-card";
import { SectionLabel } from "@/components/genesis/section-label";
import { StatCard, StatRow } from "@/components/genesis/stat-card";
import { SegmentDemo } from "./segment-demo";

/**
 * Development-only style guide.
 *
 * Renders every shared component in isolation so the design system can be
 * reviewed without the homepage around it. Not linked from any navigation and
 * returns 404 in production — it is a workbench, not a page.
 */

export const metadata: Metadata = {
  title: "Style Guide",
  robots: { index: false, follow: false },
};

const POSTERS: Poster[] = [
  { id: "kayali", client: "Kayali", title: "Product Reel", category: "Reel", meta: ["2025", "0:45"] },
  { id: "tata", client: "Tata Motors", title: "Brand Film", category: "Film", meta: ["2025", "2:10"] },
  { id: "icici", client: "ICICI Bank", title: "Brand Story", category: "Brand Story", meta: ["2024"] },
  { id: "miraggio", client: "Miraggio", title: "Lifestyle Reel", category: "Reel", meta: ["2025"] },
  { id: "yonex", client: "Yonex", title: "Ad Film", category: "Ad Film", meta: ["2024", "1:30"] },
];

export default function StyleGuidePage() {
  // Workbench only — never expose the component inventory in production.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="min-h-dvh bg-ink pb-32">
      <div className="mx-auto max-w-6xl px-6 pt-20">
        <SectionLabel dot>Phase 1 · Design system</SectionLabel>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-bone">
          Genesis <span className="font-serif italic text-amber">style guide</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">
          Every shared component in isolation. Dev-only route — returns 404 in
          production and is not linked from any navigation.
        </p>
      </div>

      <Section title="Colour tokens" note="Crimson is the brand accent, taken from existing Genesis artwork (img-012/013). Amber carries the light-on-paper motif. Teal comes from the brief and is not evidenced in the references.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            ["void", "#08080a"],
            ["ink", "#0a0a0b"],
            ["elevated", "#131316"],
            ["raised", "#1c1a20"],
            ["crimson", "#ff2d3f"],
            ["crimson-deep", "#c9102b"],
            ["amber", "#ff8a3d"],
            ["amber-light", "#ffd08a"],
            ["teal", "#2dd4bf"],
            ["bone", "#f5f5f4"],
            ["ash", "#a3a3a3"],
            ["faint", "#6b6b70"],
          ].map(([name, hex]) => (
            <div key={name} className="rounded-xl border border-white/10 p-2">
              <div
                className="h-14 w-full rounded-lg border border-white/10"
                style={{ backgroundColor: hex }}
              />
              <p className="mt-2 text-[11px] font-medium text-bone">{name}</p>
              <p className="text-[10px] text-faint">{hex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-6">
          <SectionLabel dot>Micro label · letterspaced caps</SectionLabel>
          <h2 className="text-5xl font-semibold tracking-tight text-bone">
            Built for the <span className="font-serif italic text-amber">thinkers</span>
          </h2>
          <h3 className="text-fade-down text-4xl font-semibold tracking-tight">
            Two-tone headline treatment
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-ash">
            Body copy sits at ash on ink. Line length is capped near 65
            characters so long-form sections stay readable at desktop widths.
          </p>
        </div>
      </Section>

      <Section title="Glass surfaces" note="One UI 'Blur' — heavy blur, low-contrast fill, lit top edge. Not the iOS 'Clear' style.">
        <div className="relative overflow-hidden rounded-3xl">
          {/* A busy ground so the blur has something to actually blur. */}
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg,#ff2d3f,#ff8a3d,#2dd4bf,#ff2d3f)] opacity-40 blur-2xl" />
          <div className="relative grid gap-4 p-8 sm:grid-cols-3">
            <div className="glass rounded-2xl p-6 text-sm text-bone">.glass</div>
            <div className="glass glass-lit rounded-2xl p-6 text-sm text-bone">
              .glass .glass-lit
            </div>
            <div className="glass glass-strong glass-lit rounded-2xl p-6 text-sm text-bone">
              .glass-strong
            </div>
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <GlassButton variant="crimson" arrow>Contact us</GlassButton>
          <GlassButton variant="luminous">Schedule a call</GlassButton>
          <GlassButton variant="glass" arrow>Start a project</GlassButton>
          <GlassButton variant="ghost">Learn more</GlassButton>
          <GlassButton variant="crimson" size="lg" arrow magnetic>
            Magnetic CTA
          </GlassButton>
          <GlassButton variant="glass" size="sm">Small</GlassButton>
        </div>
        <div className="mt-8">
          <SegmentDemo />
        </div>
      </Section>

      <Section title="Brand mark" note="Placeholder, reconstructed from the references. Replace when real logo files land.">
        <div className="flex flex-wrap items-center gap-10">
          <GenesisMark />
          <GenesisStar className="size-8" />
        </div>
      </Section>

      <Section title="Stat card & stat row">
        <div className="space-y-6">
          <StatCard
            value="1,00,000+"
            label="Influencer database"
            description="A curated network of creators across every niche and platform."
            icon={<Users className="size-6" />}
            action={<GlassButton variant="ghost" size="sm">→</GlassButton>}
            className="max-w-xl"
          />
          <StatRow
            stats={[
              { value: "500+", label: "Campaigns executed", icon: <Target className="size-5" /> },
              { value: "200+", label: "Brands partnered", icon: <Sparkles className="size-5" /> },
              { value: "50M+", label: "Content reach", icon: <Globe className="size-5" /> },
              { value: "20+", label: "Platforms covered", icon: <Globe className="size-5" /> },
            ]}
          />
          <p className="text-xs text-faint">
            TODO(copy): all figures above are placeholders pending real numbers.
          </p>
        </div>
      </Section>

      <Section title="Movie-poster case-study card" note="Drag or scroll the rail. Placeholder artwork is generated from each id.">
        <PosterRail posters={POSTERS} />
      </Section>

      <Section title="Orbiting / draggable cards" note="Orbit pauses on hover; each card can be dragged off and snaps back.">
        <OrbitingCards
          items={[
            { id: "1", label: "Travel Creator", sublabel: "856K followers" },
            { id: "2", label: "Fitness Creator", sublabel: "2.4M followers", accent: "amber" },
            { id: "3", label: "Lifestyle Creator", sublabel: "1.2M followers" },
            { id: "4", label: "Finance Creator", sublabel: "1.1M followers", accent: "teal" },
            { id: "5", label: "Fashion Creator", sublabel: "947K followers" },
          ]}
          center={
            <div className="glass glass-lit grid size-24 place-items-center rounded-full">
              <GenesisStar className="size-8" />
            </div>
          }
        />
      </Section>

      <Section title="Animated timeline" note="The lit rail fills as the section scrolls.">
        <AnimatedTimeline
          milestones={[
            { date: "Mar 2024", title: "Genesis founded", description: "TODO(copy): placeholder milestone." },
            { date: "Aug 2024", title: "First brand film", description: "TODO(copy): placeholder milestone." },
            { date: "Feb 2025", title: "Creator network at 50K", description: "TODO(copy): placeholder milestone." },
            { date: "Nov 2025", title: "AI studio launched", description: "TODO(copy): placeholder milestone." },
          ]}
        />
      </Section>

      <Section title="Magnetic floating paper cards" note="The connective motif — paper caught in a single light.">
        <div className="space-y-10">
          <div className="flex flex-wrap gap-8">
            <PaperCard pinned className="w-64">
              <p className="micro-label mb-2">Pinned</p>
              <p className="text-sm text-ash">
                Hover to straighten and lift. Rotation resets on approach.
              </p>
            </PaperCard>
            <PaperCard tone="crimson" rotate={2.5} className="w-64">
              <p className="micro-label mb-2">Crimson sheen</p>
              <p className="text-sm text-ash">Directional light along the top edge.</p>
            </PaperCard>
          </div>
          <PaperStack
            items={[
              { title: "Preparation", caption: "research, inspiration", body: "TODO(copy): placeholder." },
              { title: "Incubation", caption: "letting ideas simmer", body: "TODO(copy): placeholder." },
              { title: "Illumination", caption: "refine & execute", body: "TODO(copy): placeholder." },
            ]}
          />
        </div>
      </Section>

      <Section title="Logo marquee" note="Seamless loop; pauses on hover. Wordmarks stand in for real client logos.">
        <LogoMarquee
          logos={["KAYALI", "TATA MOTORS", "ICICI BANK", "MIRAGGIO", "YONEX", "KREO TECH", "DOT & KEY"]}
        />
      </Section>

      <Section title="Atmosphere" note="Dark ground + one directional light + grain. Sections compose this rather than repeating it.">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["crimson", "amber", "teal"] as const).map((tone) => (
            <Atmosphere key={tone} tone={tone} origin="top-right" className="rounded-2xl">
              <div className="flex h-40 items-end p-5">
                <span className="micro-label">{tone}</span>
              </div>
            </Atmosphere>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-bone">{title}</h2>
        {note && <p className="mt-2 max-w-2xl text-xs leading-relaxed text-faint">{note}</p>}
      </div>
      {children}
    </section>
  );
}
