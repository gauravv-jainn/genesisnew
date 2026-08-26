import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getInsiderAccess } from "@/lib/access";

export const metadata: Metadata = {
  title: "Insider",
  // Never let the internal surface into search results.
  robots: { index: false, follow: false },
};

// Session state is per-request; nothing under /insider may be prerendered.
export const dynamic = "force-dynamic";

/**
 * The authorization boundary for Genesis Insider.
 *
 * `proxy.ts` also redirects unauthenticated users, but that is only an
 * optimistic check. This layout is the enforcement point every child page
 * inherits.
 */
export default async function InsiderLayout({
  children,
}: LayoutProps<"/insider">) {
  const access = await getInsiderAccess();

  if (access.status === "unauthenticated") {
    redirect("/auth/login?returnTo=/insider");
  }

  if (access.status === "unconfigured") {
    return (
      <InsiderNotice title="Insider is not configured yet">
        <p>
          Waiting on credentials for: <strong>{access.missing.join(", ")}</strong>.
        </p>
        <p className="text-muted-foreground">
          Add them to the environment (see <code>.env.example</code>) and this
          page will start gating on a real Auth0 session.
        </p>
      </InsiderNotice>
    );
  }

  if (access.status === "forbidden") {
    return (
      <InsiderNotice title="You do not have access">
        <p>
          {access.email ?? "This account"} is signed in but has not been granted
          an Insider role.
        </p>
        <p className="text-muted-foreground">
          Ask an owner to assign a role in Auth0, then sign in again.
        </p>
        <a className="underline underline-offset-4" href="/auth/logout">
          Sign out
        </a>
      </InsiderNotice>
    );
  }

  return <>{children}</>;
}

function InsiderNotice({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="flex max-w-md flex-col gap-3 rounded-card border border-border bg-card p-8 text-small">
        <h1 className="text-body font-normal">{title}</h1>
        {children}
      </div>
    </main>
  );
}
