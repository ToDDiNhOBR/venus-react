require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const {
  SPREADSHEET_ID,
  CLIENTS_SPREADSHEET_ID,
  PROFILE_SPREADSHEET_ID,
  CLIENTS_SHEET,
  PROSPECTS_SHEET,
  INDICADOR_SPREADSHEET_ID,
  INDICADOR_SHEET,
  USUARIOS_SPREADSHEET_ID,
  USUARIOS_SHEET,
  NOTIFICATIONS_SPREADSHEET_ID,
  NOTIFICATIONS_SHEET,
} = require('./sheets');

const app = express();
const PORT = process.env.PORT || 5002;

// Serve user profile images statically
app.use('/user-perfil-images', express.static(path.join(__dirname, '../src/user-perfil-images')));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://192.168.1.45:3000']
}));

app.use(express.json({ limit: '10mb' }));

let sheets;

async function initializeSheets() {
  try {
    console.log('Initializing Google Sheets API...');
    const keyFilePath = path.resolve(__dirname, 'google-credentials.json');
    console.log('Resolved keyFile path:', keyFilePath);

    if (!fs.existsSync(keyFilePath)) {
      throw new Error(`Google credentials file not found at path: ${keyFilePath}`);
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

async function startServer() {
  try {
    sheets = await initializeSheets();

    const { router: filiaisRouter, setSheets: setFiliaisSheets } = require('./filiais-api');
    setFiliaisSheets(sheets);
    app.use('/api/admin/filiais', filiaisRouter);

    const indicadorProspectsRouter = require('./api-indicador-prospects');
    app.use('/api/indicador', indicadorProspectsRouter);

    const userImageUploadRouter = require('./userImageUpload');
    app.use('/api/user-image', userImageUploadRouter);

    const productsRouter = require('./products');

    // Logging middleware for /api/products to debug 404 issue
    app.use('/api/products', (req, res, next) => {
      console.log(`Received request for /api/products: ${req.method} ${req.originalUrl}`);
      next();
    });

    app.use('/api/products', productsRouter);

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the process using this port or change the port.`);
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to initialize Google Sheets API. Server not started.');
  }
}

// Helper functions for getting next available codes
async function getNextClientCode() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CLIENTS_SPREADSHEET_ID,
      range: `${CLIENTS_SHEET}!A2:A`,
    });

    const values = response.data.values || [];
    const codes = values.map(row => parseInt(row[0] || '0'));
    const maxCode = Math.max(0, ...codes);
    return (maxCode + 1).toString().padStart(6, '0');
  } catch (error) {
    console.error('Error getting next client code:', error);
    throw error;
  }
}

async function getNextProspectCode() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${PROSPECTS_SHEET}!A2:A`,
    });

    const values = response.data.values || [];
    const codes = values.map(row => parseInt(row[0] || '0'));
    const maxCode = Math.max(0, ...codes);
    return (maxCode + 1).toString().padStart(6, '0');
  } catch (error) {
    console.error('Error getting next prospect code:', error);
    throw error;
  }
}

async function getNextIndicadorCode() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: INDICADOR_SPREADSHEET_ID,
      range: `${INDICADOR_SHEET}!A2:A`,
    });

    const values = response.data.values || [];
    const codes = values.map(row => parseInt(row[0] || '0'));
    const maxCode = Math.max(0, ...codes);
    return (maxCode + 1).toString().padStart(6, '0');
  } catch (error) {
    console.error('Error getting next indicador code:', error);
    throw error;
  }
}

async function getNextUsuarioCode() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: USUARIOS_SPREADSHEET_ID,
      range: `${USUARIOS_SHEET}!A2:A`,
    });

    const values = response.data.values || [];
    const codes = values.map(row => parseInt(row[0] || '0'));
    const maxCode = Math.max(0, ...codes);
    return (maxCode + 1).toString().padStart(6, '0');
  } catch (error) {
    console.error('Error getting next usuario code:', error);
    throw error;
  }
}

// GET endpoint to fetch notifications
app.get('/api/notifications', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    // Fetch global notifications from NOTIFICATIONS_SHEET
    const globalResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
      range: `${NOTIFICATIONS_SHEET}!A2:D`,
    });

    const globalRows = globalResponse.data.values || [];

    // Map global notifications
    const globalNotifications = globalRows.map(row => ({
      id: row[0] || '',
      title: row[1] || '',
      message: row[2] || '',
      date: row[3] || '',
      sender: 'Todos',
      isGlobal: true,
    }));

    // Fetch all usuarios from the usuarios sheet including column B (name) and AC (notifications)
    const userResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: USUARIOS_SPREADSHEET_ID,
      range: `${USUARIOS_SHEET}!B2:AC`,
    });

    const userRows = userResponse.data.values || [];

    // Aggregate personal notifications from all users with sender name from column B
    let personalNotifications = [];
    for (const row of userRows) {
      const senderName = row[0]; // Column B is index 0 in this range
      const notificationsJson = row[27]; // Column AC is index 27 in this range
      if (notificationsJson) {
        try {
          const userNotifications = JSON.parse(notificationsJson);
          if (Array.isArray(userNotifications)) {
            // Add sender name to each notification without overwriting id
            const notificationsWithSender = userNotifications.map((notif) => ({
              ...notif,
              sender: senderName || 'Unknown',
              isGlobal: false,
            }));
            personalNotifications = personalNotifications.concat(notificationsWithSender);
          }
        } catch (e) {
          console.warn('Failed to parse notifications JSON:', e);
        }
      }
    }

    // Combine global and personal notifications
    const notifications = [...globalNotifications, ...personalNotifications];

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      message: 'Erro ao buscar notificações',
      error: error.message,
    });
  }
});

// POST endpoint to add a notification
app.post('/api/notifications', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const { title, message, recipient } = req.body;

    if (!title || !message || !recipient) {
      return res.status(400).json({ message: 'Título, mensagem e destinatário são obrigatórios' });
    }

    // Helper function to generate a unique ID for notifications
    const generateUniqueId = () => {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Assign a unique id to the new notification
    const newNotification = { id: generateUniqueId(), title, message, date: new Date().toISOString() };

    if (recipient === 'Todos') {
      // Add notification to global NOTIFICATIONS_SHEET
      // Fetch existing global notifications
      const globalResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
        range: `${NOTIFICATIONS_SHEET}!A2:D`,
      });

      const globalRows = globalResponse.data.values || [];

      // Append new notification row
      const newRow = [newNotification.id, newNotification.title, newNotification.message, newNotification.date];

      await sheets.spreadsheets.values.append({
        spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
        range: `${NOTIFICATIONS_SHEET}!A:D`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [newRow],
        },
      });

      res.json({ success: true, message: 'Notificação global adicionada com sucesso' });
    } else {
      // Update specific user notifications JSON
      // Fetch all usuarios to update notifications column (AC)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: USUARIOS_SPREADSHEET_ID,
        range: `${USUARIOS_SHEET}!A2:AC`,
      });

      const rows = response.data.values || [];

      // Helper to add notification to existing notifications JSON string
      const addNotificationToJson = (existingJson, newNotif) => {
        let notifications = [];
        try {
          notifications = existingJson ? JSON.parse(existingJson) : [];
        } catch {
          notifications = [];
        }
        notifications.push(newNotif);
        return JSON.stringify(notifications);
      };

      const userIndex = rows.findIndex(row => row[0] === recipient);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário destinatário não encontrado' });
      }
      const currentNotif = rows[userIndex][28] || '[]';
      rows[userIndex][28] = addNotificationToJson(currentNotif, newNotification);

      // Clear existing notifications column data (except header)
      await sheets.spreadsheets.values.clear({
        spreadsheetId: USUARIOS_SPREADSHEET_ID,
        range: `${USUARIOS_SHEET}!AC2:AC`,
      });

      // Append updated notifications column data
      const notificationsColumn = rows.map(row => [row[28] || '[]']);
      await sheets.spreadsheets.values.append({
        spreadsheetId: USUARIOS_SPREADSHEET_ID,
        range: `${USUARIOS_SHEET}!AC2:AC`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: notificationsColumn,
        },
      });

      res.json({ success: true, message: 'Notificação adicionada com sucesso' });
    }
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({
      message: 'Erro ao adicionar notificação',
      error: error.message,
    });
  }
});

// DELETE endpoint to delete a notification by id
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const notificationId = req.params.id.trim();

    // Try to delete from global notifications first
    const globalResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
      range: `${NOTIFICATIONS_SHEET}!A2:D`,
    });

    const globalRows = globalResponse.data.values || [];
    const globalIndex = globalRows.findIndex(row => (row[0] || '').trim() === notificationId);

    if (globalIndex !== -1) {
      // Remove the notification row from global notifications
      globalRows.splice(globalIndex, 1);

      // Clear the existing data range (except header)
      await sheets.spreadsheets.values.clear({
        spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
        range: `${NOTIFICATIONS_SHEET}!A2:D`,
      });

      // Append the updated rows back to the sheet
      if (globalRows.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
          range: `${NOTIFICATIONS_SHEET}!A2:D`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: globalRows,
          },
        });
      }

      return res.json({ success: true, message: 'Notificação global apagada com sucesso' });
    }

    // If not found in global, try to delete from personal notifications
    const userResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: USUARIOS_SPREADSHEET_ID,
      range: `${USUARIOS_SHEET}!A2:AC`,
    });

    const userRows = userResponse.data.values || [];

    let notificationFound = false;

    // Iterate over each user row to find and remove the notification
    for (let i = 0; i < userRows.length; i++) {
      const notificationsJson = userRows[i][28] || '[]'; // Column AC is index 28
      let notifications = [];
      try {
        notifications = JSON.parse(notificationsJson);
      } catch (e) {
        notifications = [];
      }

      const originalLength = notifications.length;
      // Filter out the notification with matching id (trimmed)
      notifications = notifications.filter(notif => (notif.id || '').trim() !== notificationId);

      if (notifications.length !== originalLength) {
        // Notification found and removed
        notificationFound = true;
        // Update the notifications JSON string in the row
        userRows[i][28] = JSON.stringify(notifications);
        // Update the sheet for this user's notifications column
        const rowNumber = i + 2; // offset for header and 1-based index
        await sheets.spreadsheets.values.update({
          spreadsheetId: USUARIOS_SPREADSHEET_ID,
          range: `${USUARIOS_SHEET}!AC${rowNumber}:AC${rowNumber}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[userRows[i][28]]],
          },
        });
        break; // Exit loop after deleting notification
      }
    }

    if (!notificationFound) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    res.json({ success: true, message: 'Notificação apagada com sucesso' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      message: 'Erro ao apagar notificação',
      error: error.message,
    });
  }
});

// PUT endpoint to update a notification by id
app.put('/api/notifications/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const notificationId = req.params.id;
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Título e mensagem são obrigatórios' });
    }

    // Try to update in global notifications first
    const globalResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
      range: `${NOTIFICATIONS_SHEET}!A2:D`,
    });

    const globalRows = globalResponse.data.values || [];
    const globalIndex = globalRows.findIndex(row => (row[0] || '') === notificationId);

    if (globalIndex !== -1) {
      // Update the notification row
      globalRows[globalIndex][1] = title;
      globalRows[globalIndex][2] = message;

      // Calculate the row number in the sheet (offset by 2 because header + 1-based index)
      const rowNumber = globalIndex + 2;

      // Update the row in the sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: NOTIFICATIONS_SPREADSHEET_ID,
        range: `${NOTIFICATIONS_SHEET}!A${rowNumber}:D${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [globalRows[globalIndex]],
        },
      });

      return res.json({ success: true, message: 'Notificação global atualizada com sucesso' });
    }

    // If not found in global, try to update in personal notifications
    const userResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: USUARIOS_SPREADSHEET_ID,
      range: `${USUARIOS_SHEET}!A2:AC`,
    });

    const userRows = userResponse.data.values || [];

    let notificationFound = false;

    // Iterate over each user row to find and update the notification
    for (let i = 0; i < userRows.length; i++) {
      const notificationsJson = userRows[i][28] || '[]'; // Column AC is index 28
      let notifications = [];
      try {
        notifications = JSON.parse(notificationsJson);
      } catch (e) {
        notifications = [];
      }

      const notifIndex = notifications.findIndex(notif => (notif.id || '') === notificationId);

      if (notifIndex !== -1) {
        // Update the notification
        notifications[notifIndex].title = title;
        notifications[notifIndex].message = message;

        // Update the notifications JSON string in the row
        userRows[i][28] = JSON.stringify(notifications);

        // Update the sheet for this user's notifications column
        const rowNumber = i + 2; // offset for header and 1-based index
        await sheets.spreadsheets.values.update({
          spreadsheetId: USUARIOS_SPREADSHEET_ID,
          range: `${USUARIOS_SHEET}!AC${rowNumber}:AC${rowNumber}`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[userRows[i][28]]],
          },
        });

        notificationFound = true;
        break; // Exit loop after updating notification
      }
    }

    if (!notificationFound) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    res.json({ success: true, message: 'Notificação atualizada com sucesso' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      message: 'Erro ao atualizar notificação',
      error: error.message,
    });
  }
});

// Client endpoints
app.post('/api/clients', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    console.log('Received client data:', req.body);
    console.log('Spreadsheet ID:', CLIENTS_SPREADSHEET_ID);
    console.log('Sheet name:', CLIENTS_SHEET);

    // First, verify we can access the spreadsheet
    try {
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: CLIENTS_SPREADSHEET_ID
      });
      console.log('Successfully accessed spreadsheet:', sheetInfo.data.properties.title);
    } catch (error) {
      console.error('Error accessing spreadsheet:', error);
      throw new Error(`Cannot access spreadsheet: ${error.message}`);
    }

    const clientData = req.body;
    
    // Validate required fields
    if (!clientData.nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome/Razão Social é obrigatório'
      });
    }

    if (!clientData.setor) {
      return res.status(400).json({
        success: false,
        message: 'Setor é obrigatório'
      });
    }

    console.log('Getting next client code...');
    const clientCode = await getNextClientCode();
    console.log('Generated client code:', clientCode);
    
    // Prepare row data with explicit type conversion
    const rowData = [
      clientCode,
      String(clientData.tipo || ''),
      String(clientData.cpf || ''),
      String(clientData.nome || ''),
      String(clientData.setor || ''),
      String(clientData.contribuinteICMS || 'Não'),
      String(clientData.inscricaoEstadual || ''),
      String(clientData.inscricaoMunicipal || ''),
      String(clientData.representante || ''),
      String(clientData.telefone || ''),
      String(clientData.celular || ''),
      String(clientData.email || ''),
      String(clientData.cep || ''),
      String(clientData.logradouro || ''),
      String(clientData.numero || ''),
      String(clientData.complemento || ''),
      String(clientData.bairro || ''),
      String(clientData.cidade || ''),
      String(clientData.estado || ''),
      String(clientData.followUp || ''),
      new Date().toISOString(), // Data de cadastro
    ];

    console.log('Row data to append:', rowData);
    console.log('Appending data to sheet...');
    
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: CLIENTS_SPREADSHEET_ID,
      range: `${CLIENTS_SHEET}!A:U`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });
    console.log('Sheet response:', appendResponse.data);

    res.json({ 
      success: true, 
      message: 'Cliente cadastrado com sucesso',
      clientCode 
    });
  } catch (error) {
    console.error('Error creating client:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    let errorMessage = 'Erro ao cadastrar cliente';
    if (error.message.includes('API not initialized')) {
      errorMessage = 'Erro de conexão com Google Sheets';
    } else if (error.response?.status === 403) {
      errorMessage = 'Erro de permissão ao acessar a planilha';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message 
    });
  }
});

// New GET endpoint to fetch all clients with optional filtering
app.get('/api/clients', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const { code, cpfCnpj, name, representative, sector } = req.query;

    // Fetch all clients from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CLIENTS_SPREADSHEET_ID,
      range: `${CLIENTS_SHEET}!A2:U`,
    });

    const rows = response.data.values || [];

    // Map rows to client objects
    const clients = rows.map(row => ({
      id: row[0] || '',
      code: row[0] || '',
      tipo: row[1] || '',
      cpfCnpj: row[2] || '',
      name: row[3] || '',
      setor: row[4] || '',
      contribuinteICMS: row[5] || '',
      inscricaoEstadual: row[6] || '',
      inscricaoMunicipal: row[7] || '',
      representante: row[8] || '',
      telefone: row[9] || '',
      celular: row[10] || '',
      email: row[11] || '',
      cep: row[12] || '',
      logradouro: row[13] || '',
      numero: row[14] || '',
      complemento: row[15] || '',
      bairro: row[16] || '',
      cidade: row[17] || '',
      estado: row[18] || '',
      followUp: row[19] || '',
      dataCadastro: row[20] || '',
    }));

    // Filter clients based on query parameters
    const filteredClients = clients.filter(client => {
      if (code && (!client.code || !client.code.includes(code))) return false;
      if (cpfCnpj) {
        const cleanSearchCpfCnpj = cpfCnpj.replace(/\D/g, '');
        const cleanClientCpfCnpj = (client.cpfCnpj || '').replace(/\D/g, '');
        if (!cleanClientCpfCnpj.includes(cleanSearchCpfCnpj)) return false;
      }
      if (name && (!client.name || !client.name.toLowerCase().includes(name.toLowerCase()))) return false;
      if (representative && (!client.representante || !client.representante.includes(representative))) return false;
      if (sector && (!client.setor || !client.setor.includes(sector))) return false;
      return true;
    });

    res.json({ clients: filteredClients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      message: 'Erro ao buscar clientes',
      error: error.message,
    });
  }
});

// New GET endpoint to fetch a single client by ID
app.get('/api/clients/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const clientId = req.params.id;

    // Fetch all clients from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CLIENTS_SPREADSHEET_ID,
      range: `${CLIENTS_SHEET}!A2:U`,
    });

    const rows = response.data.values || [];

    // Find client by ID
    const row = rows.find(row => row[0] === clientId);

    if (!row) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Map row to client object
    const client = {
      id: row[0] || '',
      code: row[0] || '',
      tipo: row[1] || '',
      cpf: row[2] || '',
      nome: row[3] || '',
      setor: row[4] || '',
      contribuinteICMS: row[5] || '',
      inscricaoEstadual: row[6] || '',
      inscricaoMunicipal: row[7] || '',
      representante: row[8] || '',
      telefone: row[9] || '',
      celular: row[10] || '',
      email: row[11] || '',
      cep: row[12] || '',
      logradouro: row[13] || '',
      numero: row[14] || '',
      complemento: row[15] || '',
      bairro: row[16] || '',
      cidade: row[17] || '',
      estado: row[18] || '',
      followUp: row[19] || '',
      dataCadastro: row[20] || '',
    };

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      message: 'Erro ao buscar cliente',
      error: error.message,
    });
  }
});

// DELETE endpoint to delete client by ID
app.delete('/api/clients/:id', async (req, res) => {
  try {
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    const clientId = req.params.id;

    // Fetch all clients from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CLIENTS_SPREADSHEET_ID,
      range: `${CLIENTS_SHEET}!A2:U`,
    });

    const rows = response.data.values || [];

    // Find index of client by ID
    const clientIndex = rows.findIndex(row => row[0] === clientId);

    if (clientIndex === -1) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Remove the client row from the array
    rows.splice(clientIndex, 1);

    // Clear the existing data range (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: CLIENTS_SPREADSHEET_ID,
      range: `${CLIENTS_SHEET}!A2:U`,
    });

    // Append the updated rows back to the sheet
    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: CLIENTS_SPREADSHEET_ID,
        range: `${CLIENTS_SHEET}!A2:U`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: rows,
        },
      });
    }

    res.json({ success: true, message:
