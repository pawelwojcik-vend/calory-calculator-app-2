var SHEET_ID = '1MWLdzbXLL6ouEeWgvPgk4BmPGT-sVQYtFvzIdrOte84';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

  var timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  sheet.appendRow([
    timestamp,        // Sygnatura czasowa
    data.type,        // Typ
    data.description, // Opis
    data.calories,    // Kalorie
    data.date         // Data
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}