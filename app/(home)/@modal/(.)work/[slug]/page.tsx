import { notFound } from "next/navigation";

import { WorkDetail } from "@/components/genesis/work-detail";
import { RouteModal } from "@/components/genesis/route-modal";
import { findWork } from "@/lib/work";

/**
 * The same project, intercepted into a dialog when it is reached from inside
 * the app — clicking a tile in the grid opens this instead of navigating away.
 *
 * `(.)work` intercepts the sibling `/work` route at this level. A cold load or
 * a refresh of the same URL bypasses the interception entirely and renders
 * the real page, which is exactly the behaviour the brief asks for: a popup
 * while browsing, a page when shared.
 */
export default async function WorkModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findWork(slug);
  if (!item) notFound();

  return (
    <RouteModal label={`${item.client} — ${item.title}`}>
      <WorkDetail item={item} />
    </RouteModal>
  );
}
