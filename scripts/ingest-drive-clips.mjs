/**
 * Turn a Google Drive folder of master videos into web-ready hover previews.
 *
 *   node scripts/ingest-drive-clips.mjs <driveFolderId>
 *
 * WHY THIS EXISTS. Genesis's work lands as full-resolution masters — the first
 * folder averaged 51MB a file, 2GB in total, with single clips 200x the weight
 * of the entire homepage. None of it can be served. This produces, per file, a
 * four-second silent loop at 720px on the long edge plus a poster frame:
 * measured at 11.5MB -> 82KB, a ~140x reduction.
 *
 * IT NEVER DOWNLOADS THE MASTERS. ffmpeg reads the Drive URL over HTTP and
 * range-requests only the leading seconds it needs, so a 2GB folder costs a
 * few hundred MB of transfer and about six seconds a file. Pulling all of it
 * first would take an hour and 2GB of disk to throw away.
 *
 * `drive.usercontent.google.com` rather than `drive.google.com/uc`, because
 * the latter serves an HTML interstitial instead of the file once a file is
 * large enough to warrant a virus-scan warning — which shows up as a
 * zero-byte download rather than an error.
 *
 * The folder must be link-viewable. Requires ffmpeg on PATH.
 */
import { execFile } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { promisify } from "node:util";

const run = promisify(execFile);
const folderId = process.argv[2];
if (!folderId) {
  console.error("usage: node scripts/ingest-drive-clips.mjs <driveFolderId>");
  process.exit(1);
}

const OUT = new URL("../public/work", import.meta.url).pathname;
const src = (id) =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
/** One filter for both orientations: reels are portrait, films landscape. */
const SCALE =
  "scale='if(gt(iw,ih),720,-2)':'if(gt(iw,ih),-2,720)':flags=lanczos";

/** Drive's embedded folder view is plain HTML, so no API key is needed. */
async function listFolder(id) {
  const html = await fetch(
    `https://drive.google.com/embeddedfolderview?id=${id}#list`,
  ).then((r) => r.text());
  const ids = [...html.matchAll(/id="entry-([^"]+)"/g)].map((m) => m[1]);
  const names = [...html.matchAll(/flip-entry-title">([^<]*)<\/div>/g)].map(
    (m) => m[1],
  );
  return ids.map((id, i) => ({ id, name: names[i] ?? `${i}` }));
}

const files = (await listFolder(folderId)).filter((f) => /\.(mp4|mov|m4v)$/i.test(f.name));
if (files.length === 0) {
  console.error("No video files found — is the folder link-viewable?");
  process.exit(1);
}
mkdirSync(`${OUT}/clips`, { recursive: true });
mkdirSync(`${OUT}/posters`, { recursive: true });

async function convert(file) {
  const stem = file.name.replace(/\.[^.]+$/, "");
  const clip = `${OUT}/clips/${stem}.mp4`;
  const poster = `${OUT}/posters/${stem}.jpg`;
  const opts = { maxBuffer: 1 << 26 };
  await run("ffmpeg", ["-v","error","-y","-i",src(file.id),"-t","4","-an",
    "-vf",`${SCALE},fps=24`,"-c:v","libx264","-profile:v","high","-crf","30",
    "-preset","slow","-pix_fmt","yuv420p","-movflags","+faststart",clip], opts);
  await run("ffmpeg", ["-v","error","-y","-i",src(file.id),"-frames:v","1",
    "-vf",SCALE,"-q:v","4",poster], opts);
  return { stem, clip: statSync(clip).size, poster: statSync(poster).size };
}

// Four at a time: encoding is CPU-bound and fetching is network-bound, so a
// small pool keeps both busy without thrashing either.
const queue = [...files];
const done = [];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const file = queue.shift();
      try {
        const r = await convert(file);
        done.push(r);
        console.log(`${r.stem}: ${(r.clip / 1024) | 0}KB clip, ${(r.poster / 1024) | 0}KB poster`);
      } catch (error) {
        console.log(`${file.name}: FAILED — ${String(error.message).slice(0, 120)}`);
      }
    }
  }),
);

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`\n${done.length}/${files.length} converted`);
console.log(`clips ${mb(done.reduce((s, r) => s + r.clip, 0))}MB, posters ${mb(done.reduce((s, r) => s + r.poster, 0))}MB`);
