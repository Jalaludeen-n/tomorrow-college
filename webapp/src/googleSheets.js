// googleSheets.js
import con from "./../cred.json"

const CLIENT_ID = cred.CLIENT_ID; // Replace with your actual client ID
const API_KEY = cred.CLIENT_ID; // Optional, only required if using API key with the Google Sheets API
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

const initGoogleSheets = () => {
  return new Promise((resolve, reject) => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
          ],
          scope: SCOPES,
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

export { initGoogleSheets };
