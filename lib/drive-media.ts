import "server-only";

import { getDriveClient, getRootFolderId, isDriveConfigured } from "./google-drive";

/**
 * Resolving a public-looking media path to a file inside Genesis's Drive.
 *
 * WHAT THIS IS FOR, AND WHAT IT IS NOT FOR. Drive is the file store — the
 * place Genesis actually keeps footage and stills — so the site should be able
 * to read from it rather than requiring every asset to be committed to the
 * repository and redeployed. That is a workflow win: drop a file in a folder,
 * it is on the site.
 *
 * It is NOT a content delivery network and must not be used as one. Drive
 * rate-limits per file, serves interstitials under load, and its Range support
 * is poor enough that scrubbing a video through it is unreliable. Anything
 * fetched here is therefore fetched ONCE and then served from our own cache
 * headers for a year — see the route in app/api/media. Drive is the origin of
 * record; it is never in the hot path twice for the same file.
 *
 * PATHS MIRROR /public. `work/clips/10.mp4` here is the same file that lives
 * at /work/clips/10.mp4 in the repo, so switching a caller between the two is
 * a prefix and nothing else, and a Drive folder that mirrors /public is a
 * structure a person can keep tidy without being told a scheme.
 */

export type DriveMediaFile = {
  id: string;
  name: string;
  mimeType: string;
  /** Bytes, when Drive reports it. Absent for some Google-native types. */
  size?: number;
};

/**
 * Drive's query language delimits string literals with single quotes and has
 * no other escaping, so a name containing one has to be backslash-escaped or
 * it terminates the literal early. A file called `it's.mp4` is not exotic.
 */
function quote(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * Rejects anything that is not a plain relative path.
 *
 * The segments arrive from a URL, so this is the boundary where a request
 * stops being someone else's text. `..` is the obvious one; the rest matter
 * because these segments are interpolated into a Drive query, and a name
 * carrying a quote or a backslash that got past `quote()` above would change
 * what that query means.
 */
export function isSafeMediaPath(segments: string[]): boolean {
  if (segments.length === 0 || segments.length > 8) return false;
  return segments.every(
    (segment) =>
      segment.length > 0 &&
      segment.length <= 128 &&
      segment !== "." &&
      segment !== ".." &&
      !segment.includes("/") &&
      !segment.includes("\\") &&
      // Control characters only. Spaces and hyphens are ordinary in a
      // filename — dot-and-key.webp is one of ours — so this tests code
      // points below 0x20 plus DEL, rather than a punctuation range.
      ![...segment].some((ch) => {
        const code = ch.codePointAt(0) ?? 0;
        return code < 0x20 || code === 0x7f;
      }),
  );
}

/**
 * Resolved paths, kept for the life of the server process.
 *
 * The map holds the PROMISE rather than the result, which is what makes it a
 * lock as well as a cache: fifteen tiles asking for the same clip in the same
 * tick share one Drive round trip instead of racing fifteen. A miss is cached
 * too — a file that is not in Drive should not be looked for again on every
 * request, because the answer is a folder listing either way.
 */
const resolved = new Map<string, Promise<DriveMediaFile | null>>();

/** Clears the resolution cache. For tests, and for a future revalidate hook. */
export function clearDriveMediaCache(): void {
  resolved.clear();
}

async function findChild(
  parentId: string,
  name: string,
): Promise<DriveMediaFile | null> {
  const drive = getDriveClient();
  const response = await drive.files.list({
    q: `'${quote(parentId)}' in parents and name = '${quote(name)}' and trashed = false`,
    fields: "files(id,name,mimeType,size)",
    // Two, not one: it lets a duplicate name be detected rather than silently
    // resolving to whichever Drive happened to return first.
    pageSize: 2,
    // Both flags, or a service account pointed at a Shared Drive sees nothing
    // and the failure looks like an empty folder rather than a config error.
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = response.data.files ?? [];
  const file = files[0];
  if (!file?.id) return null;

  return {
    id: file.id,
    name: file.name ?? name,
    mimeType: file.mimeType ?? "application/octet-stream",
    size: file.size ? Number(file.size) : undefined,
  };
}

/**
 * Walks `work/clips/10.mp4` down from the configured root folder.
 *
 * One listing per segment. It is not free, which is exactly why the result is
 * memoised above and why the route that calls it sets a year of cache: the
 * walk happens once per file per deploy, not once per viewer.
 */
export async function resolveDriveMedia(
  segments: string[],
): Promise<DriveMediaFile | null> {
  if (!isDriveConfigured() || !isSafeMediaPath(segments)) return null;

  const root = getRootFolderId();
  if (!root) return null;

  const key = segments.join("/");
  const cached = resolved.get(key);
  if (cached) return cached;

  const lookup = (async () => {
    let parent = root;
    for (const segment of segments.slice(0, -1)) {
      const folder = await findChild(parent, segment);
      if (!folder) return null;
      parent = folder.id;
    }
    return findChild(parent, segments[segments.length - 1]);
  })().catch(() => null);

  resolved.set(key, lookup);
  return lookup;
}
