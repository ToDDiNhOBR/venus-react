const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

let sheets;

const SPREADSHEET_ID = '1PS9NIBCoD3rSP_9t_Y311ojf1e8vjJLI5fXXJAzJQ1c';
const CLIENTS_SPREADSHEET_ID = '1oc0vZLI_svl7pqQRRvW5i6CTAG9f8Ud0ZE3wUT2lEKA';
const PROFILE_SPREADSHEET_ID = '1v-efneD8b_GWhCDQekRQl3ZW2gwM7noG84SXatuOhWY';
const PROFILE_SHEET = 'Profile';
const CLIENTS_SHEET = 'Clientes';

const PROSPECTS_SHEET = 'Prospects';

const INDICADOR_SPREADSHEET_ID = '1LR2EeJfHS050colOwlZGi8jdQLUkgS5gOaKy1EsVIIM';
const INDICADOR_SHEET = 'Indicador';

const USUARIOS_SPREADSHEET_ID = '1b_5P9KKdwIUay-M2mbjx3fQt_utD6-DmA9rcJXHEjhk';
const USUARIOS_SHEET = 'Usuarios';
const PRODUTOS_SPREADSHEET_ID = '1zTyVETqDgRriMxBSjbcbz7soBvyInaU2D6DfOuGMxx4';
const PRODUTOS_SHEET = 'Produto';

const NOTIFICATIONS_SHEET = 'Notificacoes';
const NOTIFICATIONS_SPREADSHEET_ID = '1BcFx2OTyAmBpQmDnAW0lIpoHPQE_ugrUUL0gozDD-aU';

async function initializeSheets() {
  try {
    console.log('Initializing Google Sheets API...');
    const keyFilePath = path.resolve(__dirname, 'google-credentials.json');
    console.log('Resolved keyFile path:', keyFilePath);

    if (!fs.existsSync(keyFilePath)) {
      throw new Error('Google credentials file not found at path: ' + keyFilePath);
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    // Test authentication by trying to access spreadsheets
    await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    await sheets.spreadsheets.get({
      spreadsheetId: PROFILE_SPREADSHEET_ID
    });
    await sheets.spreadsheets.get({
      spreadsheetId: USUARIOS_SPREADSHEET_ID
    });
    await sheets.spreadsheets.get({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID
    });

    console.log('Successfully connected to Google Sheets API for all spreadsheets');
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    if (error.code === 'ENOENT') {
      console.error('google-credentials.json file not found');
    } else if (error.response?.status === 403) {
      console.error('Authentication failed - check service account permissions');
    } else if (error.response?.status === 404) {
      console.error('Spreadsheet not found - check SPREADSHEET_ID or PROFILE_SHEET');
    }
    console.error('Full error details:', error);
    throw error;
  }
}

function getSheets() {
  if (!sheets) {
    throw new Error('Google Sheets API not initialized');
  }
  return sheets;
}

function setSheets(sheetsClient) {
  sheets = sheetsClient;
}

async function getNextId(spreadsheetId, sheetName) {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:A`,
  });

  const values = response.data.values || [];
  const ids = values.map(row => parseInt(row[0] || '0'));
  const maxId = Math.max(0, ...ids);
  return (maxId + 1).toString().padStart(6, '0');
}

module.exports = {
  initializeSheets,
  getSheets,
  setSheets,
  getNextId,
  SPREADSHEET_ID,
  CLIENTS_SPREADSHEET_ID,
  PROFILE_SPREADSHEET_ID,
  PROFILE_SHEET,
  CLIENTS_SHEET,
  PROSPECTS_SHEET,
  INDICADOR_SPREADSHEET_ID,
  INDICADOR_SHEET,
  USUARIOS_SPREADSHEET_ID,
  USUARIOS_SHEET,
  PRODUTOS_SPREADSHEET_ID,
  PRODUTOS_SHEET,
  NOTIFICATIONS_SHEET,
  NOTIFICATIONS_SPREADSHEET_ID,
};
