var SHEET_ID = '1MWLdzbXLL6ouEeWgvPgk4BmPGT-sVQYtFvzIdrOte84';

function doGet(e) {
  var params = e.parameter;

  if (!params.type || !params.calories || !params.buster || params.buster !== 'ja-pierdole-kocham-paczki-69-!-123') {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'missing params' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

  var timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  sheet.appendRow([
    timestamp,        // Sygnatura czasowa
    params.type,      // Typ
    params.description, // Opis
    params.calories,  // Kalorie
    params.date       // Data
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
