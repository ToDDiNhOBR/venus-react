const express = require('express');
const router = express.Router();

const PROFILE_SPREADSHEET_ID = '1v-efneD8b_GWhCDQekRQl3ZW2gwM7noG84SXatuOhWY';
const PROFILE_SHEET = 'Profile';

let sheets;

function setSheets(sheetsInstance) {
  sheets = sheetsInstance;
}

// GET all filiais
router.get('/', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A2:Z`,
    });

    const rows = response.data.values || [];

    const filiais = rows.map(row => ({
      id: row[0] || '',
      code: row[0] || '',
      nome: row[1] || '',
      cnpj: row[2] || '',
      inscricaoEstadual: row[3] || '',
      inscricaoMunicipal: row[4] || '',
      cep: row[5] || '',
      logradouro: row[6] || '',
      numero: row[7] || '',
      complemento: row[8] || '',
      bairro: row[9] || '',
      cidade: row[10] || '',
      uf: row[11] || '',
      telefone: row[12] || '',
      email: row[13] || '',
      filial: row[14] || '',
    }));

    res.json({ filiais });
  } catch (error) {
    console.error('Error fetching filiais:', error);
    res.status(500).json({
      message: 'Erro ao buscar filiais',
      error: error.message,
    });
  }
});

// GET filial by id
router.get('/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const filialId = req.params.id;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A2:Z`,
    });

    const rows = response.data.values || [];

    const row = rows.find(row => row[0] === filialId);

    if (!row) {
      return res.status(404).json({ message: 'Filial não encontrada' });
    }

    const filial = {
      id: row[0] || '',
      code: row[0] || '',
      nome: row[1] || '',
      cnpj: row[2] || '',
      inscricaoEstadual: row[3] || '',
      inscricaoMunicipal: row[4] || '',
      cep: row[5] || '',
      logradouro: row[6] || '',
      numero: row[7] || '',
      complemento: row[8] || '',
      bairro: row[9] || '',
      cidade: row[10] || '',
      uf: row[11] || '',
      telefone: row[12] || '',
      email: row[13] || '',
      filial: row[14] || '',
    };

    res.json(filial);
  } catch (error) {
    console.error('Error fetching filial:', error);
    res.status(500).json({
      message: 'Erro ao buscar filial',
      error: error.message,
    });
  }
});

// POST create new filial
router.post('/', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const filialData = req.body;

    if (!filialData.nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome da filial é obrigatório'
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A2:A`,
    });

    const values = response.data.values || [];
    const codes = values.map(row => parseInt(row[0] || '0'));
    const maxCode = Math.max(0, ...codes);
    const nextCode = (maxCode + 1).toString().padStart(6, '0');

    const rowData = [
      nextCode,
      String(filialData.nome || ''),
      String(filialData.cnpj || ''),
      String(filialData.inscricaoEstadual || ''),
      String(filialData.inscricaoMunicipal || ''),
      String(filialData.cep || ''),
      String(filialData.logradouro || ''),
      String(filialData.numero || ''),
      String(filialData.complemento || ''),
      String(filialData.bairro || ''),
      String(filialData.cidade || ''),
      String(filialData.uf || ''),
      String(filialData.telefone || ''),
      String(filialData.email || ''),
      String(filialData.filial || ''),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });

    res.json({ success: true, message: 'Filial cadastrada com sucesso', code: nextCode });
  } catch (error) {
    console.error('Error creating filial:', error);
    res.status(500).json({
      message: 'Erro ao cadastrar filial',
      error: error.message,
    });
  }
});

// PUT update filial by id
router.put('/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const filialId = req.params.id;
    const updateData = req.body;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A2:Z`,
    });

    const rows = response.data.values || [];

    const filialIndex = rows.findIndex(row => row[0] === filialId);

    if (filialIndex === -1) {
      return res.status(404).json({ message: 'Filial não encontrada' });
    }

    const existingRow = rows[filialIndex];

    const existingData = {
      id: existingRow[0] || '',
      nome: existingRow[1] || '',
      cnpj: existingRow[2] || '',
      inscricaoEstadual: existingRow[3] || '',
      inscricaoMunicipal: existingRow[4] || '',
      cep: existingRow[5] || '',
      logradouro: existingRow[6] || '',
      numero: existingRow[7] || '',
      complemento: existingRow[8] || '',
      bairro: existingRow[9] || '',
      cidade: existingRow[10] || '',
      uf: existingRow[11] || '',
      telefone: existingRow[12] || '',
      email: existingRow[13] || '',
      filial: existingRow[14] || '',
    };

    const mergedData = {
      ...existingData,
      ...updateData,
    };

    const updatedRow = [
      mergedData.id,
      mergedData.nome,
      mergedData.cnpj,
      mergedData.inscricaoEstadual,
      mergedData.inscricaoMunicipal,
      mergedData.cep,
      mergedData.logradouro,
      mergedData.numero,
      mergedData.complemento,
      mergedData.bairro,
      mergedData.cidade,
      mergedData.uf,
      mergedData.telefone,
      mergedData.email,
      mergedData.filial,
    ];

    const rowNumber = filialIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A${rowNumber}:O${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [updatedRow],
      },
    });

    res.json({ success: true, message: 'Filial atualizada com sucesso' });
  } catch (error) {
    console.error('Error updating filial:', error);
    res.status(500).json({
      message: 'Erro ao atualizar filial',
      error: error.message,
    });
  }
});

// DELETE filial by id
router.delete('/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const filialId = req.params.id;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A2:Z`,
    });

    const rows = response.data.values || [];

    const filialIndex = rows.findIndex(row => row[0] === filialId);

    if (filialIndex === -1) {
      return res.status(404).json({ message: 'Filial não encontrada' });
    }

    rows.splice(filialIndex, 1);

    await sheets.spreadsheets.values.clear({
      spreadsheetId: PROFILE_SPREADSHEET_ID,
      range: `${PROFILE_SHEET}!A2:O`,
    });

    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: PROFILE_SPREADSHEET_ID,
        range: `${PROFILE_SHEET}!A2:O`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: rows,
        },
      });
    }

    res.json({ success: true, message: 'Filial apagada com sucesso' });
  } catch (error) {
    console.error('Error deleting filial:', error);
    res.status(500).json({
      message: 'Erro ao apagar filial',
      error: error.message,
    });
  }
});

module.exports = { router, setSheets };
