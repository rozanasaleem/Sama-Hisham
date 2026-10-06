const SPREADSHEET_ID = "1IxAgBAZUQQFskWu63334tNonbMPA2MUyvd7hBT3W6VA";
const SHEET_NAME = "Sendable Links";
const WEBHOOK_SECRET = "replace-with-a-private-secret";

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || "{}");

  if (WEBHOOK_SECRET && payload.secret !== WEBHOOK_SECRET) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const inviteCode = String(payload.guestSlug || "");

  if (payload.action === "status") {
    const targetRow = findInviteRow(rows, inviteCode);

    if (targetRow === -1) {
      return jsonResponse({ ok: true, rsvp: null });
    }

    const row = rows[targetRow - 1];
    const status = String(row[6] || "");

    if (!status) {
      return jsonResponse({ ok: true, rsvp: null });
    }

    return jsonResponse({
      ok: true,
      rsvp: {
        attending: String(row[7] || ""),
        plusOneAttending: String(row[8] || ""),
        plusOneName: String(row[9] || ""),
        submittedAt: row[10] ? String(row[10]) : "",
      },
    });
  }

  const submittedAt = payload.submittedAt ? new Date(payload.submittedAt) : new Date();
  const attending = payload.attending === "no" ? "no" : "yes";
  const plusOneAttending =
    attending === "yes" && payload.plusOneIncluded !== false && payload.plusOneName
      ? "yes"
      : "no";

  const targetRow = findInviteRow(rows, inviteCode);

  const rowValues = [
    attending === "yes" ? "RSVP yes" : "RSVP no",
    attending,
    plusOneAttending,
    payload.plusOneName || "",
    submittedAt,
  ];

  if (targetRow === -1) {
    sheet.appendRow([
      payload.guestName || "",
      payload.firstName || "",
      "",
      "",
      "",
      inviteCode,
      ...rowValues,
    ]);
  } else {
    sheet.getRange(targetRow, 7, 1, rowValues.length).setValues([rowValues]);
  }

  return jsonResponse({ ok: true });
}

function findInviteRow(rows, inviteCode) {
  for (let index = 1; index < rows.length; index += 1) {
    const link = String(rows[index][5] || "");

    if (link.includes(`invite=${inviteCode}`) || link === inviteCode) {
      return index + 1;
    }
  }

  return -1;
}

function jsonResponse(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
