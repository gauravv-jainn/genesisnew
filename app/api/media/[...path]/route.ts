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

    /*
      GAXIOS RETURNS A `Headers` INSTANCE, NOT A PLAIN OBJECT.

      This read them as `response.headers["content-length"]`, which on a
      Headers is undefined — so the route answered 206 Partial Content with no
      Content-Range and no Content-Length. That is a malformed partial
      response: a browser cannot tell how big the file is or which slice it
      just received, so seeking a video breaks and some players refuse it
      outright. It looked fine until something actually streamed through here,
      because a 200 with no Content-Length still plays.

      Read through the accessor, and keep the bracket form as a fallback in
      case a future version hands back an object again.
    */
    const header = (name: string): string | undefined => {
      const raw = response.headers as unknown;
      /*
        DUCK-TYPED, NOT `instanceof Headers`. The constructor is named Headers
        and the instanceof check still failed: gaxios builds its own undici
        instance, so its Headers class is a different realm's from the one in
        this module's scope. Asking whether the thing has a `get` cannot care
        which copy of the class it came from.
      */
      const get = (raw as { get?: unknown }).get;
      if (typeof get === "function") {
        const value = (get as (n: string) => string | null).call(raw, name);
        return value ?? undefined;
      }
      const value = (raw as Record<string, unknown>)[name];
      return typeof value === "string" ? value : undefined;
    };

    const length = header("content-length");
    if (length) headers.set("Content-Length", length);

    const contentRange = header("content-range");
    if (contentRange) headers.set("Content-Range", contentRange);

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
