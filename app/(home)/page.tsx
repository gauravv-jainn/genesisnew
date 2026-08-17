/**
 * Homepage — intentionally blank for Phase 0.
 *
 * Phase 2 builds the 13-section scroll narrative here, with one component per
 * section colocated in `app/(home)/components/`.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Genesis Media
      </p>
      <h1 className="text-2xl font-semibold">Phase 0 — infrastructure</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Auth, database, storage, monitoring and security headers are wired up.
        The homepage is built in Phase 2.
      </p>
    </main>
  );
}
