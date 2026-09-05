import { Readable } from "node:stream";

import { resolveDriveMedia, isSafeMediaPath } from "@/lib/drive-media";
import { getDriveClient } from "@/lib/google-drive";

/**
 * Serves a file out of Genesis's Drive at a path that mirrors /public.
 *
 * `/api/media/work/clips/10.mp4` is the Drive copy of `/work/clips/10.mp4`.
 * Callers do not choose between them; lib/media-url.ts does, from one env
 * flag, so a component never knows where its bytes came from.
 *
 * THE CACHE HEADER IS THE ENTIRE POINT OF THIS ROUTE. Pointing an <img> or a
 * <video> straight at a Drive share link is the obvious version of this idea
 * and it is a bad one: it hands every viewer a third-party DNS lookup and TLS
 * handshake, it is rate-limited per file, and Drive answers Range requests
 * poorly enough that seeking inside a video misbehaves. Proxying through here
 * means Drive is asked once per file per deploy and every viewer after that is
 * served by our own CDN, from our own origin, on a connection the browser has
 * already opened.
 *
 * `immutable` is safe because the media path is a name Genesis controls. A
 * changed file under the same name wants a deploy or a purge, which is the
 * same contract /public already has — a file in there is cached for a year by
 * the same reasoning.
 *
 * Node runtime, not edge: googleapis signs its JWT with node:crypto.
 */
export const runtime = "nodejs";

/** A year, which is what /public gets and what an addressed asset should get. */
const CACHE = "public, max-age=31536000, s-maxage=31536000, immutable";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  if (!isSafeMediaPath(path)) {
    return new Response("Bad media path", { status: 400 });
  }

  const file = await resolveDriveMedia(path);
  if (!file) {
    /*
      Not configured, or genuinely not in the folder. Either way this is a
      404 rather than a redirect to /public: a silent fallback would make a
      misconfigured Drive look like a working one, and the missing file would
      only surface the day the local copy was deleted.
    */
    return new Response("Not found", { status: 404 });
  }

  // Passed through so the browser can seek inside a video rather than pulling
  // the whole file to play the middle of it.
  const range = request.headers.get("range") ?? undefined;

  try {
    const drive = getDriveClient();
    const response = await drive.files.get(
      { fileId: file.id, alt: "media", supportsAllDrives: true },
      {
        responseType: "stream",
        ...(range ? { headers: { Range: range } } : {}),
      },
    );

    const headers = new Headers({
      "Content-Type": file.mimeType,
      "Cache-Control": CACHE,
      // The bytes are ours to serve but they are not ours to let another site
      // frame or sniff into something else.
      "X-Content-Type-Options": "nosniff",
      // Lets the browser ask for a range next time even on a fresh connection.
      "Accept-Ranges": "bytes",
    });

    const length = response.headers["content-length"];
    if (typeof length === "string") headers.set("Content-Length", length);

    const contentRange = response.headers["content-range"];
    if (typeof contentRange === "string") {
      headers.set("Content-Range", contentRange);
    }

    const body = Readable.toWeb(
      response.data as unknown as Readable,
    ) as ReadableStream<Uint8Array>;

    return new Response(body, {
      // Drive answers 206 itself when it honours the Range; mirror whatever it
      // decided rather than asserting 200 over a partial body.
      status: response.status === 206 ? 206 : 200,
      headers,
    });
  } catch {
    /*
      Deliberately opaque. A Drive failure here is a quota, a permission or a
      revoked key — all of which are ours to fix and none of which a visitor
      can act on, and the error text from googleapis carries the service
      account's identity.
    */
    return new Response("Media unavailable", { status: 502 });
  }
}
