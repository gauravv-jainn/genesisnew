import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { google } from "googleapis";

const envText = fs.readFileSync(path.resolve(".env.local"), "utf8");
const env = {};
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON;
const creds = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
const auth = new google.auth.GoogleAuth({
  credentials: { client_email: creds.client_email, private_key: creds.private_key.replace(/\\n/g, "\n") },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });

const FOLDER = "1TdZ9_CCuyGKjF984i2p-N_MaWLZP30Ek";
// Drive name -> the number it takes in /public. House of Hiranandani is
// skipped: 47.4MB / 47s / 1080x1920 is byte-for-byte clip 32 from the other
// folder, already in the catalogue.
const ASSIGN = {
  "1) Panvel Hospital Plot.mp4": 33,
  "2) Ghatkopar Godown.mp4": 34,
  "3) Chembur Commercial Office.mp4": 35,
  "4) Vashi Petrol Pump.mp4": 36,
  "5) Prajapati Ornate.mp4": 37,
  "6) Sea Facing Alibag.mp4": 38,
  "7) Alibag Plot 1.mp4": 39,
  "8) Chembur Plot": 40,
  "9) Karjat Agricultural Land.mp4": 41,
  "11) Sarda Village.mp4": 42,
};

const TMP = process.argv[2];
fs.mkdirSync(TMP, { recursive: true });

function run(cmd, args) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? res() : rej(new Error(err.slice(-500)))));
  });
}

const res = await drive.files.list({
  q: `'${FOLDER}' in parents and trashed = false`,
  fields: "files(id,name,size)", pageSize: 100,
  supportsAllDrives: true, includeItemsFromAllDrives: true,
});

for (const f of res.data.files ?? []) {
  const n = ASSIGN[f.name];
  if (!n) { console.log(`SKIP  ${f.name}`); continue; }

  const master = path.join(TMP, `${n}.src.mp4`);
  process.stdout.write(`[${n}] ${f.name} — downloading ${(Number(f.size)/1048576).toFixed(0)}MB… `);
  const dl = await drive.files.get({ fileId: f.id, alt: "media", supportsAllDrives: true }, { responseType: "stream" });
  await new Promise((res2, rej) => {
    const out = fs.createWriteStream(master);
    dl.data.on("error", rej).pipe(out).on("finish", res2).on("error", rej);
  });

  // 1s in, to clear any fade-up or black first frame.
  process.stdout.write("preview… ");
  await run("ffmpeg", ["-y", "-ss", "1", "-i", master, "-t", "4",
    "-vf", "scale=406:720", "-r", "24", "-an",
    "-c:v", "libx264", "-preset", "slow", "-b:v", "194k", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", `public/work/clips/${n}.mp4`]);

  process.stdout.write("poster… ");
  await run("ffmpeg", ["-y", "-ss", "1", "-i", master, "-frames:v", "1",
    "-vf", "scale=406:720", "-q:v", "5", `public/work/posters/${n}.jpg`]);

  fs.unlinkSync(master);
  const kb = (fs.statSync(`public/work/clips/${n}.mp4`).size / 1024).toFixed(0);
  console.log(`done (${kb}KB)`);
}
console.log("ALL DONE");
