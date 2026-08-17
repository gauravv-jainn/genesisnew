import { getInsiderAccess } from "@/lib/access";

/**
 * Genesis Insider — dashboard shell.
 *
 * Phase 0 proves the auth round-trip only. The full Genesis Workspace
 * (clients, projects, content pipeline, invoicing, automations) is a separate
 * build and explicitly out of scope here.
 */
export default async function InsiderPage() {
  const access = await getInsiderAccess();

  // The layout already blocks every non-granted state; this narrows the type.
  if (access.status !== "granted") return null;

  const { user } = access;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Genesis Insider
        </p>
        <h1 className="text-2xl font-semibold">
          {user.name ?? user.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {user.email} · role {user.role}
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6 text-sm">
        <h2 className="font-medium">Workspace</h2>
        <p className="mt-2 text-muted-foreground">
          The Insider shell is in place: Auth0 handles the session, and the
          role above is read from the local <code>users</code> table. Client,
          project, content and invoicing modules are a separate build.
        </p>
      </section>

      <a
        className="text-sm underline underline-offset-4"
        href="/auth/logout"
      >
        Sign out
      </a>
    </main>
  );
}
