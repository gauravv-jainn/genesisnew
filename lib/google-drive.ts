import "server-only";

import { google } from "googleapis";
import { z } from "zod";

import { driveEnv, isPlaceholder } from "./env";

/**
 * Google Drive (API v3) is the file store for Genesis — no S3, no Cloudinary.
 *
 * Auth is via a service account: the credentials JSON is supplied as a single
 * env var (base64-encoded, so newlines in the private key survive Vercel's
 * environment editor). Raw JSON is accepted too.
 *
 * Phase 0 provides the authenticated client and a connectivity check only.
 * There is no upload UI yet — that arrives with the Workspace build.
 *
 * SETUP: share the target Drive folder with the service account's
 * `client_email`, otherwise the account authenticates but sees an empty Drive.
 */

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const serviceAccountSchema = z.object({
  type: z.literal("service_account"),
  project_id: z.string().min(1),
  private_key: z.string().min(1),
  client_email: z.email(),
  private_key_id: z.string().optional(),
  client_id: z.string().optional(),
});

export type ServiceAccountCredentials = z.infer<typeof serviceAccountSchema>;

/** True when a real (non-placeholder) service account JSON is present. */
export function isDriveConfigured(): boolean {
  return !isPlaceholder(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

/**
 * Decodes and validates the service account credentials.
 * Accepts either raw JSON or standard base64-encoded JSON.
 */
export function parseServiceAccount(raw: string): ServiceAccountCredentials {
  const trimmed = raw.trim();
  const json = trimmed.startsWith("{")
    ? trimmed
    : Buffer.from(trimmed, "base64").toString("utf8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is neither valid JSON nor base64-encoded JSON.",
    );
  }

  const result = serviceAccountSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON is missing required fields: " +
        result.error.issues
          .map((issue) => issue.path.join("."))
          .join(", "),
    );
  }

  return {
    ...result.data,
    // Vercel stores the key with literal backslash-n sequences; PEM parsing
    // needs real newlines.
    private_key: result.data.private_key.replace(/\\n/g, "\n"),
  };
}

let authClient: InstanceType<typeof google.auth.GoogleAuth> | undefined;

function getAuth() {
  if (!authClient) {
    const { GOOGLE_SERVICE_ACCOUNT_JSON } = driveEnv();
    const credentials = parseServiceAccount(GOOGLE_SERVICE_ACCOUNT_JSON);

    authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: SCOPES,
    });
  }
  return authClient;
}

/** The authenticated Drive v3 client. */
export function getDriveClient() {
  return google.drive({ version: "v3", auth: getAuth() });
}

/** Folder the app is scoped to, when one is configured. */
export function getRootFolderId(): string | undefined {
  const id = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  return id && id.trim() !== "" ? id : undefined;
}

export type DriveVerification = {
  ok: boolean;
  serviceAccountEmail?: string;
  driveUser?: string;
  rootFolderName?: string;
  error?: string;
};

/**
 * Proves the service account can actually authenticate against Drive by
 * issuing a real API call. Used by `/api/diagnostics` to satisfy the Phase 0
 * "Drive API client authenticates successfully" check.
 */
export async function verifyDriveAccess(): Promise<DriveVerification> {
  try {
    const { GOOGLE_SERVICE_ACCOUNT_JSON } = driveEnv();
    const credentials = parseServiceAccount(GOOGLE_SERVICE_ACCOUNT_JSON);
    const drive = getDriveClient();

    const about = await drive.about.get({ fields: "user(emailAddress)" });

    const verification: DriveVerification = {
      ok: true,
      serviceAccountEmail: credentials.client_email,
      driveUser: about.data.user?.emailAddress ?? undefined,
    };

    // If a root folder is configured, confirm it is actually reachable —
    // authenticating but lacking folder access is the common misconfiguration.
    const rootFolderId = getRootFolderId();
    if (rootFolderId) {
      const folder = await drive.files.get({
        fileId: rootFolderId,
        fields: "name",
        supportsAllDrives: true,
      });
      verification.rootFolderName = folder.data.name ?? undefined;
    }

    return verification;
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
