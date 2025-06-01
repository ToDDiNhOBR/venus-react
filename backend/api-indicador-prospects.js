const express = require('express');
const router = express.Router();

// Assuming sheets, INDICADOR_SPREADSHEET_ID, INDICADOR_SHEET, SPREADSHEET_ID, PROSPECTS_SHEET are imported or accessible here
// We will require the main server file to get these or pass them as parameters in a real app
// For this example, we assume they are globally accessible

// POST endpoint to create a new indicador
router.post('/api/indicador', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const indicadorData = req.body;

    // Validate required fields
    if (!indicadorData.nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome/Razão Social é obrigatório'
      });
    }

    if (!indicadorData.setor) {
      return res.status(400).json({
        success: false,
        message: 'Setor é obrigatório'
      });
    }

    // Check for duplicate CPF/CNPJ
    const responseAll = await sheets.spreadsheets.values.get({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A2:V',
    });
    const rows = responseAll.data.values || [];
const normalizeCpfCnpj = (value) => value.replace(/\D/g, '');
    const existingIndicador = rows.find(row => {
      const cpfCnpj = row[3] || '';
      return cpfCnpj && normalizeCpfCnpj(cpfCnpj) === normalizeCpfCnpj(indicadorData.cpf);
    });
    if (existingIndicador) {
      return res.status(400).json({
        success: false,
message: `Já existe um indicador cadastrado com esse CPF/CNPJ. Código: ${existingIndicador[0]}`
      });
    }

    console.log('Getting next indicador code...');
    const indicadorCode = await getNextIndicadorCode();
    console.log('Generated indicador code:', indicadorCode);

    // Prepare row data with explicit type conversion
    const rowData = [
      indicadorCode,                          // Column A
      String(indicadorData.email || ''),     // Column B (email)
      String(indicadorData.tipo || ''),      // Column C
      String(indicadorData.cpf || ''),       // Column D
      String(indicadorData.nome || ''),      // Column E
      String(indicadorData.setor || ''),     // Column F
      String(indicadorData.telefone || ''),  // Column G (telefone)
      String(indicadorData.contribuinteICMS || 'Não'), // Column H
      String(indicadorData.cidade || ''),    // Column I (cidade)
      String(indicadorData.estado || ''),    // Column J (estado)
      String(indicadorData.cep || ''),       // Column K (cep)
      String(indicadorData.followUp || ''),  // Column L (followUp)
      String(indicadorData.inscricaoEstadual || ''),   // Column M
      String(indicadorData.inscricaoMunicipal || ''),  // Column N
      String(indicadorData.representante || ''),       // Column O
      String(indicadorData.celular || ''),              // Column P
      String(indicadorData.logradouro || ''),           // Column Q
      String(indicadorData.numero || ''),                // Column R
      String(indicadorData.complemento || ''),           // Column S
      String(indicadorData.bairro || ''),                // Column T
      // Store tags as JSON string
      String(indicadorData.tags ? JSON.stringify(indicadorData.tags) : '[]'), // Column U (tags)
      new Date().toISOString(), // Data de cadastro       // Column V
    ];

    console.log('Row data to append:', rowData);
    console.log('Appending data to sheet...');

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A:V',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });
    console.log('Sheet response:', appendResponse.data);

    res.json({
      success: true,
      message: 'Indicador cadastrado com sucesso',
      indicadorCode
    });
  } catch (error) {
    console.error('Error creating indicador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar indicador',
      error: error.message
    });
  }
});

// PUT endpoint to update indicador by ID with partial update support
router.put('/api/indicador/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const indicadorId = req.params.id;
    const updateData = req.body;

    // Fetch all indicadores from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A2:V',
    });

    const rows = response.data.values || [];

    // Find index of indicador by ID
    const indicadorIndex = rows.findIndex(row => row[0] === indicadorId);

    if (indicadorIndex === -1) {
      return res.status(404).json({ message: 'Indicador não encontrado' });
    }

    // Get the existing row to preserve fields not sent in update
    const existingRow = rows[indicadorIndex];

    // Map existing row to object for easier update
    const existingData = {
      id: existingRow[0] || '',
      email: existingRow[1] || '',
      tipo: existingRow[2] || '',
      cpfCnpj: existingRow[3] || '',
      name: existingRow[4] || '',
      setor: existingRow[5] || '',
      telefone: existingRow[6] || '',
      contribuinteICMS: existingRow[7] || 'Não',
      cidade: existingRow[8] || '',
      estado: existingRow[9] || '',
      cep: existingRow[10] || '',
      followUp: existingRow[11] || '',
      inscricaoEstadual: existingRow[12] || '',
      inscricaoMunicipal: existingRow[13] || '',
      representante: existingRow[14] || '',
      celular: existingRow[15] || '',
      logradouro: existingRow[16] || '',
      numero: existingRow[17] || '',
      complemento: existingRow[18] || '',
      bairro: existingRow[19] || '',
      tags: existingRow[20] || '',
      dataCadastro: existingRow[21] || '',
    };

    // Merge updateData into existingData, only overwrite fields provided
    const mergedData = {
      ...existingData,
      ...updateData,
    };

    // Ensure tags is a string for Google Sheets
    if (Array.isArray(mergedData.tags)) {
      mergedData.tags = JSON.stringify(mergedData.tags);
    } else if (!mergedData.tags) {
      mergedData.tags = '[]';
    }

    // Prepare updated row data array
    const updatedRow = [
      mergedData.id,
      mergedData.email,
      mergedData.tipo,
      mergedData.cpfCnpj,
      mergedData.name,
      mergedData.setor,
      mergedData.telefone,
      mergedData.contribuinteICMS,
      mergedData.cidade,
      mergedData.estado,
      mergedData.cep,
      mergedData.followUp,
      mergedData.inscricaoEstadual,
      mergedData.inscricaoMunicipal,
      mergedData.representante,
      mergedData.celular,
      mergedData.logradouro,
      mergedData.numero,
      mergedData.complemento,
      mergedData.bairro,
      mergedData.tags,
      mergedData.dataCadastro,
    ];

    // Calculate the row number in the sheet (offset by 2 because header + 1-based index)
    const rowNumber = indicadorIndex + 2;

    // Update the row in the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A' + rowNumber + ':V' + rowNumber,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [updatedRow],
      },
    });

    res.json({ success: true, message: 'Indicador atualizado com sucesso' });
  } catch (error) {
    console.error('Error updating indicador:', error);
    res.status(500).json({
      message: 'Erro ao atualizar indicador',
      error: error.message,
    });
  }
});

// DELETE endpoint to delete indicador by ID
router.delete('/api/indicador/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const indicadorId = req.params.id;

    // Fetch all indicadores from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A2:V',
    });

    const rows = response.data.values || [];

    // Find index of indicador by ID
    const indicadorIndex = rows.findIndex(row => row[0] === indicadorId);

    if (indicadorIndex === -1) {
      return res.status(404).json({ message: 'Indicador não encontrado' });
    }

    // Remove the indicador row from the array
    rows.splice(indicadorIndex, 1);

    // Clear the existing data range (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A2:V',
    });

    // Append the updated rows back to the sheet
    if (rows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: INDICADOR_SHEET + '!A2:V',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: rows,
      },
    });
    }

    res.json({ success: true, message: 'Indicador apagado com sucesso' });
  } catch (error) {
    console.error('Error deleting indicador:', error);
    res.status(500).json({
      message: 'Erro ao apagar indicador',
      error: error.message,
    });
  }
});

// GET endpoint to fetch prospect by CNPJ
router.get('/api/prospects/by-cnpj', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const cnpj = req.query.cnpj;
    if (!cnpj) {
      return res.status(400).json({ message: 'CNPJ é obrigatório' });
    }

    // Fetch all prospects from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: PROSPECTS_SHEET + '!A2:V',
    });

    const rows = response.data.values || [];

    // Find prospect by CNPJ
    const prospectRow = rows.find(row => {
      const prospectCnpj = row[3] || '';
      const cleanProspectCnpj = prospectCnpj.replace(/\\D/g, '');
      const cleanQueryCnpj = cnpj.replace(/\\D/g, '');
      return cleanProspectCnpj === cleanQueryCnpj;
    });

    if (!prospectRow) {
      return res.status(404).json({ message: 'Prospect não encontrado' });
    }

    // Map row to prospect object
    const prospect = {
      id: prospectRow[0] || '',
      code: prospectRow[0] || '',
      email: prospectRow[1] || '',
      tipo: prospectRow[2] || '',
      cpfCnpj: prospectRow[3] || '',
      name: prospectRow[4] || '',
      setor: prospectRow[5] || '',
      telefone: prospectRow[6] || '',
      contribuinteICMS: prospectRow[7] || '',
      cidade: prospectRow[8] || '',
      estado: prospectRow[9] || '',
      cep: prospectRow[10] || '',
      followUp: prospectRow[11] || '',
      inscricaoEstadual: prospectRow[12] || '',
      inscricaoMunicipal: prospectRow[13] || '',
      representante: prospectRow[14] || '',
      celular: prospectRow[15] || '',
      logradouro: prospectRow[16] || '',
      numero: prospectRow[17] || '',
      complemento: prospectRow[18] || '',
      bairro: prospectRow[19] || '',
      tags: prospectRow[20] ? JSON.parse(prospectRow[20]) : [],
      dataCadastro: prospectRow[21] || '',
    };

    res.json(prospect);
  } catch (error) {
    console.error('Error fetching prospect by CNPJ:', error);
    res.status(500).json({
      message: 'Erro ao buscar prospect por CNPJ',
      error: error.message,
    });
  }
});

module.exports = router;
