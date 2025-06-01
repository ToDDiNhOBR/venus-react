const express = require('express');
const router = express.Router();

const { getSheets, getNextId, PRODUTOS_SPREADSHEET_ID, PRODUTOS_SHEET } = require('./sheets');

// GET all products
router.get('/', async (req, res) => {
  try {
    const sheets = getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID,
      range: `${PRODUTOS_SHEET}!A2:G`,
    });

    const rows = response.data.values || [];

    const products = rows.map(row => ({
      id: row[0] || '',
      nomeProduto: row[1] || '',
      ncm: row[2] || '',
      unidade: row[3] || '',
      valorUnitario: row[4] || '',
      categoria: row[5] || '',
      descricao: row[6] || ''
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Erro ao buscar produtos',
      error: error.message,
    });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    const sheets = getSheets();
    const productData = req.body;

    if (!productData.nomeProduto || !productData.ncm || !productData.unidade || !productData.valorUnitario) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    const nextId = await getNextId(PRODUTOS_SPREADSHEET_ID, PRODUTOS_SHEET);

    const rowData = [
      nextId,
      String(productData.nomeProduto || ''),
      String(productData.ncm || ''),
      String(productData.unidade || ''),
      String(productData.valorUnitario || ''),
      String(productData.categoria || ''),
      String(productData.descricao || '')
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID,
      range: `${PRODUTOS_SHEET}!A:G`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });

    res.json({
      success: true,
      message: 'Produto cadastrado com sucesso',
      productId: nextId
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar produto',
      error: error.message,
    });
  }
});

// PUT update product by id
router.put('/:id', async (req, res) => {
  try {
    const sheets = getSheets();
    const productId = req.params.id;
    const updateData = req.body;

    if (!updateData.nomeProduto || !updateData.ncm || !updateData.unidade || !updateData.valorUnitario) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID,
      range: `${PRODUTOS_SHEET}!A2:G`,
    });

    const rows = response.data.values || [];
    const productIndex = rows.findIndex(row => row[0] === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const updatedRow = [
      productId,
      String(updateData.nomeProduto || ''),
      String(updateData.ncm || ''),
      String(updateData.unidade || ''),
      String(updateData.valorUnitario || ''),
      String(updateData.categoria || ''),
      String(updateData.descricao || '')
    ];

    const rowNumber = productIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID,
      range: `${PRODUTOS_SHEET}!A${rowNumber}:G${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [updatedRow],
      },
    });

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error.message,
    });
  }
});

// DELETE product by id
router.delete('/:id', async (req, res) => {
  try {
    const sheets = getSheets();
    const productId = req.params.id;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID,
      range: `${PRODUTOS_SHEET}!A2:G`,
    });

    const rows = response.data.values || [];
    const productIndex = rows.findIndex(row => row[0] === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    rows.splice(productIndex, 1);

    await sheets.spreadsheets.values.clear({
      spreadsheetId: PRODUTOS_SPREADSHEET_ID,
      range: `${PRODUTOS_SHEET}!A2:G`,
    });

    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: PRODUTOS_SPREADSHEET_ID,
        range: `${PRODUTOS_SHEET}!A2:G`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: rows,
        },
      });
    }

    res.json({ success: true, message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Erro ao excluir produto',
      error: error.message,
    });
  }
});

module.exports = router;
