import "server-only";

import { google } from "googleapis";

import { isDriveConfigured, parseServiceAccount } from "./google-drive";

/**
 * Form submissions, appended to a Google Sheet.
 *
 * WHY A SHEET AND NOT ONLY THE DATABASE. Genesis asked for the form's backend
 * to be Sheets, and for a lead form that is the right instinct: the people who
 * act on an enquiry are the ones who need to see it, and they already live in
 * a spreadsheet. A Postgres row is only visible to whoever has a client and a
 * connection string.
 *
 * IT DOES NOT REPLACE THE DATABASE, IT SITS BESIDE IT. A sheet is a document
 * — it can be sorted, edited and deleted by anyone with the link, which is
 * exactly what makes it useful and exactly why it is not a record of what was
 * submitted. When both are configured a submission is written to both, and
 * the form succeeds if EITHER lands. When only one is, that one carries it,
 * which is what makes the form work before the database exists.
 *
 * SETUP: share the target spreadsheet with the service account's
 * `client_email` as an Editor, and put its id — the long string in the sheet's
 * URL between /d/ and /edit — in GOOGLE_SHEETS_ID.
 */

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/**
 * The tab written to, and the columns, in order.
 *
 * The header is written once, when the sheet is empty, so a fresh spreadsheet
 * becomes readable without anyone having to set it up by hand. It is never
 * rewritten — if someone renames a column to suit how they work, that is
 * their sheet and this has no business correcting it.
 */
const TAB = "Submissions";
const HEADER = [
  "Received",
  "Type",
  "Name",
  "Email",
  "Company",
  "Phone",
  "Message",
  "Source",
] as const;

export type SubmissionRow = {
  type: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  message?: string | null;
  source?: string | null;
};

/** True when a real service account AND a spreadsheet id are both present. */
export function isSheetsConfigured(): boolean {
  const id = process.env.GOOGLE_SHEETS_ID;
  return isDriveConfigured() && Boolean(id && id.trim() !== "");
}

let client: ReturnType<typeof google.sheets> | undefined;

function getSheets() {
  if (!client) {
    const credentials = parseServiceAccount(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "",
    );
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      /*
        Its own scope, not the Drive client's. That account can already reach
        every file in the shared folder; there is no reason for a token minted
        to write one spreadsheet row to also carry Drive write access.
      */
      scopes: SCOPES,
    });
    client = google.sheets({ version: "v4", auth });
  }
  return client;
}

/**
 * Creates the Submissions tab if the spreadsheet has not got one.
 *
 * A NEW SHEET COMES WITH ONE TAB CALLED "Sheet1", AND NOTHING TOLD ANYONE.
 * Genesis shared a spreadsheet, enabled the API, and every submission would
 * still have failed — appending to `Submissions!A:H` when no such tab exists
 * is a 400, and because appendSubmission never throws, the failure would have
 * been silent and the form would have blamed the database instead.
 *
 * Asking a person to rename a tab to an exact string is a setup step that gets
 * missed once and then debugged for an hour. Making the tab is one API call.
 *
 * Failing here must not stop the append either: if the tab already exists this
 * throws a duplicate error, which is the success case.
 */
async function ensureTab(spreadsheetId: string): Promise<void> {
  try {
    const sheets = getSheets();
    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });
    const titles = (meta.data.sheets ?? []).map((s) => s.properties?.title);
    if (titles.includes(TAB)) return;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: TAB } } }],
      },
    });
  } catch {
    // Raced by another submission, or no permission to add one. The append
    // below reports the real outcome either way.
  }
}

/**
 * Writes the header row if — and only if — the sheet has nothing in it.
 *
 * Failing here must not stop the append: a missing header is cosmetic, a lost
 * lead is not.
 */
async function ensureHeader(spreadsheetId: string): Promise<void> {
  try {
    const sheets = getSheets();
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${TAB}!A1:H1`,
    });
    if (existing.data.values && existing.data.values.length > 0) return;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...HEADER]] },
    });
  } catch {
    // See above.
  }
}

/**
 * Appends one submission. Returns whether it landed.
 *
 * NEVER THROWS. It is called from a server action that has already accepted a
 * visitor's enquiry, and a Sheets outage is not something to show them or a
 * reason to lose what they typed — the caller decides what to do with `false`.
 */
export async function appendSubmission(row: SubmissionRow): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID?.trim();
  if (!spreadsheetId || !isSheetsConfigured()) return false;

  try {
    await ensureTab(spreadsheetId);
    await ensureHeader(spreadsheetId);

    await getSheets().spreadsheets.values.append({
      spreadsheetId,
      range: `${TAB}!A:H`,
      valueInputOption: "RAW",
      /*
        INSERT_ROWS, not OVERWRITE. Overwrite appends after the last row the
        API can see, which on a sheet someone has been filtering or editing is
        not always the last row of data — INSERT_ROWS puts a new row in and
        cannot land on top of anything.
      */
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            row.type,
            row.name,
            row.email,
            row.company ?? "",
            row.phone ?? "",
            row.message ?? "",
            row.source ?? "",
          ],
        ],
      },
    });
    return true;
  } catch {
    return false;
  }
}
