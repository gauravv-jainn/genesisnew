/**
 * The one place that decides where a media file is served from.
 *
 * NOT server-only, deliberately. Half the components that render media are
 * client components — the work grid and the Studios reel wall both are — so a
 * decision made with `server-only` here would simply break their build. It
 * reads a NEXT_PUBLIC flag instead, which is inlined at build time and so
 * costs nothing at runtime on either side.
 *
 * OFF BY DEFAULT, AND OFF IS AN IDENTITY FUNCTION. With the flag unset this
 * returns its argument unchanged, so the site serves exactly the bytes it
 * serves today, from /public, with no redirect and no route in the way. That
 * matters more than it sounds: turning this on before Drive is populated would
 * take a working site and point it at 404s, and a media layer whose "off"
 * state is anything other than "the current behaviour, exactly" is a layer you
 * cannot safely ship ahead of the content.
 *
 * TURNING IT ON is two environment variables and a folder:
 *   1. GOOGLE_SERVICE_ACCOUNT_JSON  — the service account, base64 or raw.
 *   2. GOOGLE_DRIVE_ROOT_FOLDER_ID  — a folder shared with that account's
 *      client_email, laid out the way /public is: work/clips/1.mp4 and so on.
 *   3. NEXT_PUBLIC_MEDIA_FROM_DRIVE=1
 *
 * /api/diagnostics already reports whether 1 and 2 authenticate, so the
 * sequence is: set them, check diagnostics, then set 3.
 *
 * WHAT IT DOES NOT DO is make the site load faster, and it is worth writing
 * that down next to the switch. Measured on this page, all of /public is 5.6MB
 * with a 292KB largest file, against 9.6MB of JavaScript — media is not what
 * the page is spending its weight on, and Drive is slower per request than the
 * CDN already serving these files. What it buys is that Genesis can change
 * footage without a commit and a deploy.
 */

const FROM_DRIVE = process.env.NEXT_PUBLIC_MEDIA_FROM_DRIVE === "1";

/** True when media is being served out of Drive rather than /public. */
export const mediaFromDrive = FROM_DRIVE;

/**
 * Takes a public path and returns wherever that file should actually be read
 * from. `/work/clips/10.mp4` stays itself, or becomes
 * `/api/media/work/clips/10.mp4`.
 *
 * Anything that is already absolute — a full URL, a data URI — is returned
 * untouched, so a caller that has its own hosting is not quietly rewritten.
 */
export function mediaUrl(path: string): string {
  if (!FROM_DRIVE) return path;
  if (!path.startsWith("/")) return path;
  if (path.startsWith("/api/")) return path;
  return `/api/media${path}`;
}
