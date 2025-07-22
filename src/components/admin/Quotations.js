import React, { useState, useEffect } from 'react';

// Format a number as Brazilian Real currency string for input display
const formatBRLInput = (value) => {
  if (value === null || value === undefined) return '';
  const number = Number(value);
  if (isNaN(number)) return '';
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Parse a Brazilian Real currency formatted string back to a number
const parseBRLInput = (value) => {
  if (!value) return 0;
  // Remove all non-digit, non-comma, non-dot characters
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
};

const formatBRL = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Navigation steps configuration
const STEPS = [
  { id: 1, name: 'Orçamento e Imposto', icon: '📋' },
  { id: 2, name: 'Cliente', icon: '👤' },
  { id: 3, name: 'Itens', icon: '🛍️' },
  { id: 4, name: 'Frete', icon: '🚛' },
  { id: 5, name: 'Contrato', icon: '📝' },
  { id: 6, name: 'Observações', icon: '📋' },
  { id: 7, name: 'Resumo', icon: '📊' }
];

// Step Components
const Step1BudgetTax = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation for required fields in Step 1
    if (name === 'vendedor' && !value) {
      setErrors(prev => ({ ...prev, vendedor: 'Vendedor é obrigatório' }));
    } else if (name === 'vendedor') {
      setErrors(prev => {
        const { vendedor, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'filial' && !value) {
      setErrors(prev => ({ ...prev, filial: 'Filial é obrigatório' }));
    } else if (name === 'filial') {
      setErrors(prev => {
        const { filial, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'condicaoPagamento' && !value) {
      setErrors(prev => ({ ...prev, condicaoPagamento: 'Condição de pagamento é obrigatória' }));
    } else if (name === 'condicaoPagamento') {
      setErrors(prev => {
        const { condicaoPagamento, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'formaPagamento' && !value) {
      setErrors(prev => ({ ...prev, formaPagamento: 'Forma de pagamento é obrigatória' }));
    } else if (name === 'formaPagamento') {
      setErrors(prev => {
        const { formaPagamento, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de venda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de venda: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tipoVendaMaterial"
                checked={formData.tipoVendaMaterial}
                onChange={handleInputChange}
                className="mr-2"
              />
              Material
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tipoVendaServico"
                checked={formData.tipoVendaServico}
                onChange={handleInputChange}
                className="mr-2"
              />
              Serviço
            </label>
          </div>
        </div>
        {/* Contribuinte ICMS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribuinte de ICMS:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="contribuinteICMS"
                value="Sim"
                checked={formData.contribuinteICMS === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contribuinteICMS"
                value="Não"
                checked={formData.contribuinteICMS === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Indicador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indicador:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="indicadorSimNao"
                value="Sim"
                checked={formData.indicadorSimNao === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="indicadorSimNao"
                value="Não"
                checked={formData.indicadorSimNao === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
          {formData.indicadorSimNao === 'Sim' && (
            <input
              type="text"
              name="indicadorNome"
              value={formData.indicadorNome}
              onChange={handleInputChange}
              placeholder="Nome do Indicador"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Vendedor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendedor: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="vendedor"
            value={formData.vendedor}
            onChange={handleInputChange}
            placeholder="1638 - PEDRO PAULO VIEIRA RESENDE"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.vendedor && <p className="text-red-500 text-sm mt-1">{errors.vendedor}</p>}
        </div>

        {/* Filial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filial: <span className="text-red-500">*</span>
          </label>
          <select
            name="filial"
            value={formData.filial}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">101 - ANÁPOLIS/GO</option>
            <option value="101 - ANÁPOLIS/GO">101 - ANÁPOLIS/GO</option>
            <option value="102 - GOIÂNIA/GO">102 - GOIÂNIA/GO</option>
            <option value="103 - BRASÍLIA/DF">103 - BRASÍLIA/DF</option>
          </select>
          {errors.filial && <p className="text-red-500 text-sm mt-1">{errors.filial}</p>}
        </div>

        {/* Condição de pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condição de pagamento: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="condicaoPagamento"
            value={formData.condicaoPagamento}
            onChange={handleInputChange}
            placeholder="Digite a condição de pagamento"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.condicaoPagamento && <p className="text-red-500 text-sm mt-1">{errors.condicaoPagamento}</p>}
        </div>

        {/* Forma de pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Forma de pagamento: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="formaPagamento"
            value={formData.formaPagamento}
            onChange={handleInputChange}
            placeholder="Digite a forma de pagamento"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.formaPagamento && <p className="text-red-500 text-sm mt-1">{errors.formaPagamento}</p>}
        </div>
      </div>
    </div>
  );
};

const Step3Client = ({ formData, setFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente
          </label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleInputChange}
            placeholder="191786 - ALMIR DOMINGO MIOTTI"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cliente && <p className="text-red-500 text-sm mt-1">{errors.cliente}</p>}
        </div>

        {/* Endereço de entrega */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logradouro
            </label>
            <input
              type="text"
              name="logradouro"
              value={formData.logradouro || ''}
              onChange={handleInputChange}
              placeholder="Logradouro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bairro
            </label>
            <input
              type="text"
              name="bairro"
              value={formData.bairro || ''}
              onChange={handleInputChange}
              placeholder="Bairro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cep
            </label>
            <input
              type="text"
              name="cep"
              value={formData.cep || ''}
              onChange={handleInputChange}
              placeholder="Cep"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero || ''}
              onChange={handleInputChange}
              placeholder="Número"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cidade
            </label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade || ''}
              onChange={handleInputChange}
              placeholder="Cidade"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complemento
            </label>
            <input
              type="text"
              name="complemento"
              value={formData.complemento || ''}
              onChange={handleInputChange}
              placeholder="Complemento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <input
              type="text"
              name="estado"
              value={formData.estado || ''}
              onChange={handleInputChange}
              placeholder="Estado"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Comprador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comprador:
          </label>
          <input
            type="text"
            name="comprador"
            value={formData.comprador}
            onChange={handleInputChange}
            placeholder="Ex: PAULO, PEDRO"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ordem de compra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordem de compra:
          </label>
          <input
            type="text"
            name="ordemCompra"
            value={formData.ordemCompra}
            onChange={handleInputChange}
            placeholder="Ex: K57821"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// Step4Items component with updated layout
const Step4Items = ({ formData, setFormData, errors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitMeasure, setUnitMeasure] = useState('M');
  const [unitValue, setUnitValue] = useState('');
  const [observation, setObservation] = useState('');
  const [acrescimo, setAcrescimo] = useState(0);
  const [acrescimoType, setAcrescimoType] = useState('%');
  const [over1, setOver1] = useState(0);
  const [over1Type, setOver1Type] = useState('%');
  const [over2, setOver2] = useState(0);
  const [over2Type, setOver2Type] = useState('%');
  const [over3, setOver3] = useState(0);
  const [over3Type, setOver3Type] = useState('%');
  const [over4, setOver4] = useState(0);
  const [over4Type, setOver4Type] = useState('%');
  const [icmsPercent, setIcmsPercent] = useState(formData.icmsPercent || '');
  const [icmsPercentInput, setIcmsPercentInput] = useState(formData.icmsPercent || '');

  // New states for "Relação de peças"
  const [showPieceRelation, setShowPieceRelation] = useState(false);
  const [dimensions, setDimensions] = useState([]);
  const [currentLength, setCurrentLength] = useState('1000');
  const [currentWidth, setCurrentWidth] = useState('1000');
  const [currentPieces, setCurrentPieces] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  // New state to track editing item index
  const [editItemIndex, setEditItemIndex] = useState(-1);

  // Product search modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleAddDimension = () => {
    if (!currentLength || !currentWidth || !currentPieces) {
      alert('Preencha comprimento, largura e quantidade de peças');
      return;
    }
    const lengthNum = parseFloat(currentLength);
    const widthNum = parseFloat(currentWidth);
    const piecesNum = parseInt(currentPieces, 10);
    if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(piecesNum) || lengthNum <= 0 || widthNum <= 0 || piecesNum <= 0) {
      alert('Valores inválidos para comprimento, largura ou quantidade de peças');
      return;
    }

    const newDimension = { 
      length: lengthNum, 
      width: widthNum, 
      pieces: piecesNum,
      observacao: observation || ''
    };

    if (editIndex >= 0) {
      // Edit existing dimension
      const updated = [...dimensions];
      updated[editIndex] = newDimension;
      setDimensions(updated);
      setEditIndex(-1);
    } else {
      // Add new dimension
      setDimensions([...dimensions, newDimension]);
    }

    setCurrentLength('1000');
    setCurrentWidth('1000');
    setCurrentPieces('');
    setObservation('');
  };

  const handleEditDimension = (index) => {
    const dim = dimensions[index];
    setCurrentLength(dim.length.toString());
    setCurrentWidth(dim.width ? dim.width.toString() : '1000');
    setCurrentPieces(dim.pieces.toString());
    setEditIndex(index);
  };

  const handleDeleteDimension = (index) => {
    setDimensions(dimensions.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(-1);
      setCurrentLength('');
      setCurrentPieces('');
    }
  };

  const totalMeterage = dimensions.reduce((acc, dim) => acc + dim.length * (dim.width || 1000) * dim.pieces, 0) / 1000000; // convert mm² to m²

  const handleAddItem = () => {
    if (!searchTerm || (!showPieceRelation && !quantity) || !unitValue) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const effectiveQuantity = showPieceRelation ? totalMeterage : parseFloat(quantity);

    // Calculate valorVenda based on acrescimo and over values
    let baseValue = parseFloat(unitValue);

    // Apply acrescimo
    if (acrescimoType === '%') {
      baseValue = baseValue * (1 + acrescimo / 100);
    } else {
      baseValue = baseValue + acrescimo;
    }

    // Apply over1
    if (over1Type === '%') {
      baseValue = baseValue * (1 + over1 / 100);
    } else {
      baseValue = baseValue + over1;
    }

    // Apply over2
    if (over2Type === '%') {
      baseValue = baseValue * (1 + over2 / 100);
    } else {
      baseValue = baseValue + over2;
    }

    // Apply over3
    if (over3Type === '%') {
      baseValue = baseValue * (1 + over3 / 100);
    } else {
      baseValue = baseValue + over3;
    }

    // Apply over4
    if (over4Type === '%') {
      baseValue = baseValue * (1 + over4 / 100);
    } else {
      baseValue = baseValue + over4;
    }

    const valorVenda = baseValue;
    const valorTotal = effectiveQuantity * valorVenda;

    const newItem = {
      id: editItemIndex !== -1 && formData.items && formData.items[editItemIndex] ? formData.items[editItemIndex].id : Date.now(),
      produto: searchTerm,
      quantidade: effectiveQuantity,
      unidade: unitMeasure,
      valorTabela: parseFloat(unitValue),
      acrescimo: acrescimo,
      acrescimoType: acrescimoType,
      desconto: 0,
      descontoType: '%',
      over1: over1,
      over1Type: over1Type,
      over2: over2,
      over2Type: over2Type,
      over3: over3,
      over3Type: over3Type,
      indicador: 0,
      indicadorType: '%',
      valorVenda: valorVenda,
      valorTotal: valorTotal,
      icms: icmsPercentInput ? `${icmsPercentInput}%` : '0%',
      observacao: observation,
      pieceRelation: showPieceRelation,
      dimensions: [...dimensions],
      totalMeterage: totalMeterage
    };

    setFormData(prev => {
      if (editItemIndex !== -1) {
        // Update existing item at editItemIndex
        const updatedItems = [...prev.items];
        updatedItems[editItemIndex] = newItem;
        return {
          ...prev,
          items: updatedItems,
          icmsPercent: '' // Reset ICMS percent in formData
        };
      } else {
        // Check if an item with the same product and piece relation dimensions exists
        const existingIndex = prev.items.findIndex(item => {
          if (item.produto !== newItem.produto) return false;
          if (item.pieceRelation !== newItem.pieceRelation) return false;
          if (newItem.pieceRelation) {
            // Compare dimensions arrays length
            if (item.dimensions.length !== newItem.dimensions.length) return false;
            // Compare each dimension object
            for (let i = 0; i < item.dimensions.length; i++) {
              if (
                item.dimensions[i].length !== newItem.dimensions[i].length ||
                item.dimensions[i].pieces !== newItem.dimensions[i].pieces
              ) {
                return false;
              }
            }
          }
          return true;
        });

        if (existingIndex !== -1) {
          // Update existing item by summing quantities and recalculating totals
          const updatedItems = [...prev.items];
          const existingItem = updatedItems[existingIndex];

          const updatedQuantity = existingItem.quantidade + newItem.quantidade;
          const updatedValorTotal = updatedQuantity * newItem.valorVenda;

          updatedItems[existingIndex] = {
            ...existingItem,
            quantidade: updatedQuantity,
            valorTotal: updatedValorTotal
          };

          return {
            ...prev,
            items: updatedItems,
            icmsPercent: '' // Reset ICMS percent in formData
          };
        } else {
          // Add new item
          return {
            ...prev,
            items: [...(prev.items || []), newItem],
            icmsPercent: '' // Reset ICMS percent in formData
          };
        }
      }
    });

    // Reset form
    setSearchTerm('');
    setQuantity('');
    setUnitMeasure('M');
    setUnitValue('');
    setObservation('');
    setAcrescimo(0);
    setOver1(0);
    setOver2(0);
    setOver3(0);
    setIcmsPercent(''); // Reset ICMS percent state
    setIcmsPercentInput(''); // Reset ICMS percent input state

    // Reset piece relation states
    setShowPieceRelation(false);
    setDimensions([]);
    setCurrentLength('');
    setCurrentPieces('');
    setEditIndex(-1);
    setEditItemIndex(-1);
  };

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleIcmsPercentChange = (e) => {
    const value = e.target.value;
    setIcmsPercent(value);
    setFormData(prev => ({
      ...prev,
      icmsPercent: value
    }));
  };

  // Function to search products
  const searchProducts = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingProducts(true);
    try {
      const response = await fetch(`http://localhost:5002/api/products?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      alert('Erro ao buscar produtos: ' + error.message);
      setSearchResults([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Function to handle product selection
  const handleProductSelect = (product) => {
    setSearchTerm(product.nomeProduto);
    setUnitValue(product.valorUnitario);
    setUnitMeasure(product.unidade);
    setShowProductModal(false);
    setProductSearchTerm('');
    setSearchResults([]);
  };

  // Function to open product search modal
  const handleSearchButtonClick = () => {
    setShowProductModal(true);
    setProductSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Item Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item: <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nome / código do item"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchButtonClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              title="Buscar produto"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Product Search Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Buscar Produto</h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                title="Fechar"
              >
                &times;
              </button>
            </div>
            <input
              type="text"
              value={productSearchTerm}
              onChange={(e) => {
                setProductSearchTerm(e.target.value);
                searchProducts(e.target.value);
              }}
              placeholder="Digite o nome ou código do produto"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            {loadingProducts ? (
              <p>Carregando...</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unitário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        Nenhum produto encontrado
                      </td>
                    </tr>
                  ) : (
                    searchResults.map(product => (
                      <tr key={product.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleProductSelect(product)}>
                        <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.nomeProduto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.unidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">R$ {parseFloat(product.valorUnitario).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Relação de peças checkbox */}
      <div className="md:col-span-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPieceRelation}
            onChange={() => setShowPieceRelation(!showPieceRelation)}
            className="form-checkbox"
          />
          <span>Relação de peças</span>
        </label>
      </div>

      {/* Dimension inputs when Relação de peças is checked */}
      {showPieceRelation && (
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Especificações</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Largura:</label>
              <div className="flex">
                <input
                  type="number"
                  value={currentWidth}
                  onChange={(e) => setCurrentWidth(e.target.value)}
                  min="0"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm">MM</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comprimento:</label>
              <div className="flex">
                <input
                  type="number"
                  value={currentLength}
                  onChange={(e) => setCurrentLength(e.target.value)}
                  min="0"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm">MM</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade de Peças:</label>
              <div className="flex">
                <input
                  type="number"
                  value={currentPieces}
                  onChange={(e) => setCurrentPieces(e.target.value)}
                  min="0"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm">UN</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observação:</label>
              <input
                type="text"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Observação"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddDimension}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Incluir Dimensão
            </button>
          </div>

          {/* Dimensions table */}
          {dimensions.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f5f1e9]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Comprimento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Largura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Altura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Observação</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dimensions.map((dim, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{dim.pieces}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{dim.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{dim.width || 1000}</td>
                      <td className="px-6 py-4 whitespace-nowrap">30</td>
                      <td className="px-6 py-4 whitespace-nowrap">{dim.observacao || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEditDimension(index)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteDimension(index)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quantity, Unit Value, Observation Row */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade: <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            {!showPieceRelation ? (
              <>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-3/5 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={unitMeasure}
                  onChange={(e) => setUnitMeasure(e.target.value)}
                  className="w-2/5 px-2 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">M</option>
                  <option value="M2">M2</option>
                  <option value="Pç">PÇ</option>
                  <option value="CT">CT</option>
                  <option value="CX">CX</option>
                </select>
              </>
            ) : (
              <div className="flex">
                <input
                  type="number"
                  value={totalMeterage.toFixed(2)}
                  readOnly
                  className="w-3/5 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 cursor-not-allowed"
                />
                <span className="w-2/5 px-2 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 text-center">M</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Unitário:
          </label>
          <input
            type="number"
            value={unitValue}
            onChange={(e) => setUnitValue(e.target.value)}
            placeholder="R$ 0,00"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observação:
          </label>
          <input
            type="text"
            value={showPieceRelation ? '' : observation}
            onChange={(e) => !showPieceRelation && setObservation(e.target.value)}
            placeholder="Digite aqui caso tenha alguma observação sobre o pedido"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={showPieceRelation}
          />
        </div>
      </div>

      {/* Add Item Button */}
      <div>
        <button
          onClick={handleAddItem}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          + Incluir
        </button>
      </div>

      {/* Acréscimo, Desconto, Over 1, Over 2 Row with Aplicar button */}
      <div className="flex items-center space-x-4 mt-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Over 1</label>
        <div className="flex">
          <input
            type="number"
            value={over1}
            onChange={(e) => setOver1(Number(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <select
            value={over1Type}
            onChange={(e) => setOver1Type(e.target.value)}
            className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="%">%</option>
            <option value="R$">R$</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Over 2</label>
        <div className="flex">
          <input
            type="number"
            value={over2}
            onChange={(e) => setOver2(Number(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <select
            value={over2Type}
            onChange={(e) => setOver2Type(e.target.value)}
            className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="%">%</option>
            <option value="R$">R$</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Over 3</label>
        <div className="flex">
          <input
            type="number"
            value={over3}
            onChange={(e) => setOver3(Number(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <select
            value={over3Type}
            onChange={(e) => setOver3Type(e.target.value)}
            className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="%">%</option>
            <option value="R$">R$</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Over 4</label>
        <div className="flex">
          <input
            type="number"
            value={over4}
            onChange={(e) => setOver4(Number(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <select
            value={over4Type}
            onChange={(e) => setOver4Type(e.target.value)}
            className="px-2 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="%">%</option>
            <option value="R$">R$</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ICMS (%)</label>
        <input
          type="number"
          value={icmsPercentInput}
          onChange={(e) => setIcmsPercentInput(e.target.value)}
          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          max="100"
        />
      </div>
      <button
        onClick={() => alert('Aplicar descontos e acréscimos')}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + Aplicar
      </button>
      </div>


      {/* Itens Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#f5f1e9]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Qtd total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Un.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Valor de tabela</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Over 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Over 2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Over 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Over 4</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Valor de venda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Valor total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ICMS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formData.items?.map((item) => (
              <tr key={item.id}>
              <td className="px-6 py-4 whitespace-normal break-words max-w-xs">{item.produto}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantidade}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.unidade}</td>
              <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorTabela.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.acrescimoType === '%' ? `${item.acrescimo}%` : `R$ ${item.acrescimo.toFixed(2)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.over1Type === '%' ? `${item.over1}%` : `R$ ${item.over1.toFixed(2)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.over2Type === '%' ? `${item.over2}%` : `R$ ${item.over2.toFixed(2)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.over3Type === '%' ? `${item.over3}%` : `R$ ${item.over3.toFixed(2)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorVenda.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorTotal.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.icms}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => {
                      // Edit item: load item data into form for editing
                      setSearchTerm(item.produto);
                      setQuantity(item.quantidade);
                      setUnitMeasure(item.unidade);
                      setUnitValue(item.valorTabela);
                      setObservation(item.observacao);
                      setAcrescimo(item.acrescimo);
                      setAcrescimoType(item.acrescimoType || '%');
                      setOver1(item.over1 || 0);
                      setOver1Type(item.over1Type || '%');
                      setOver2(item.over2 || 0);
                      setOver2Type(item.over2Type || '%');
                      setOver3(item.over3 || 0);
                      setOver3Type(item.over3Type || '%');
                      setIcmsPercentInput(item.icms ? parseFloat(item.icms) : '');
                      setIcmsPercent(item.icms ? parseFloat(item.icms) : '');
                      setShowPieceRelation(item.pieceRelation || false);
                      setDimensions(item.dimensions || []);
                      // Reset current dimension inputs when editing
                      setCurrentLength('1000');
                      setCurrentWidth('1000');
                      setCurrentPieces('');
                      setEditIndex(-1);
                      setEditItemIndex(formData.items.findIndex(i => i.id === item.id));
                    }}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      // Delete item
                      setFormData(prev => ({
                        ...prev,
                        items: prev.items.filter(i => i.id !== item.id)
                      }));
                    }}
                    className="text-red-600 hover:text-red-900"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Step5Freight = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to calculate and distribute freight to items
  const handleCalcularFrete = () => {
    const valorFrete = parseFloat(formData.valorFrete || 0);
    const percentualEmbutido = parseFloat(formData.percentualEmbutido || 0);
    
    if (valorFrete <= 0) {
      alert('Por favor, insira um valor de frete válido');
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      alert('Adicione itens antes de calcular o frete');
      return;
    }

    // Calculate embedded freight value
    let freteEmbutido = 0;
    if (formData.percentualEmbutidoType === 'R$') {
      freteEmbutido = percentualEmbutido;
    } else {
      freteEmbutido = valorFrete * (percentualEmbutido / 100);
    }

    // Calculate total value of all items
    const totalValueItems = formData.items.reduce((total, item) => total + item.valorTotal, 0);

    if (totalValueItems <= 0) {
      alert('O valor total dos itens deve ser maior que zero');
      return;
    }

    // Distribute embedded freight proportionally to each item
    const updatedItems = formData.items.map(item => {
      const proportionalFreight = (item.valorTotal / totalValueItems) * freteEmbutido;
      const newUnitValue = item.valorVenda + (proportionalFreight / item.quantidade);
      const newTotalValue = newUnitValue * item.quantidade;

      return {
        ...item,
        valorVenda: newUnitValue,
        valorTotal: newTotalValue,
        freteEmbutidoItem: proportionalFreight
      };
    });

    // Update form data with new item values and freight calculations
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      freteEmbutidoCalculado: freteEmbutido,
      freteDestacadoCalculado: valorFrete - freteEmbutido
    }));

    alert(`Frete distribuído com sucesso! Frete embutido: R$ ${freteEmbutido.toFixed(2)}`);
  };

  // Calculate freight values based on type and input
  const valorFrete = parseFloat(formData.valorFrete || 0);
  const percentualEmbutido = parseFloat(formData.percentualEmbutido || 0);
  
  let freteDestacado = formData.freteDestacadoCalculado || 0;
  let freteEmbutido = formData.freteEmbutidoCalculado || 0;
  
  // If not calculated yet, show preview calculation
  if (!formData.freteEmbutidoCalculado) {
    if (formData.tipoFrete === 'FOB') {
      freteDestacado = 0;
      freteEmbutido = 0;
    } else if (formData.tipoFrete === 'CIF') {
      if (formData.percentualEmbutidoType === 'R$') {
        freteEmbutido = percentualEmbutido;
        freteDestacado = valorFrete - percentualEmbutido;
      } else {
        freteEmbutido = valorFrete * (percentualEmbutido / 100);
        freteDestacado = valorFrete - freteEmbutido;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de frete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de frete: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            {['CIF', 'FOB'].map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="tipoFrete"
                  value={option}
                  checked={formData.tipoFrete === option}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Valor de Frete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor de Frete: <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <span className="mr-2">R$</span>
            <input
              type="number"
              name="valorFrete"
              value={formData.valorFrete || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Percentual embutido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Percentual embutido: <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="number"
              name="percentualEmbutido"
              value={formData.percentualEmbutido || '0'}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-3/4 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="percentualEmbutidoType"
              value={formData.percentualEmbutidoType || '%'}
              onChange={handleInputChange}
              className="w-1/4 px-2 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="%">%</option>
              <option value="R$">R$</option>
            </select>
          </div>
        </div>

        {/* Data prevista de embarque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data prevista de embarque: <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dataPrevistaEmbarque"
            value={formData.dataPrevistaEmbarque}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cidade diferente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade diferente:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="cidadeDiferente"
                value="Sim"
                checked={formData.cidadeDiferente === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="cidadeDiferente"
                value="Não"
                checked={formData.cidadeDiferente === 'Não' || !formData.cidadeDiferente}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Endereço de entrega diferente - aparece quando "Sim" for selecionado */}
        {formData.cidadeDiferente === 'Sim' && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
            <h3 className="md:col-span-2 text-lg font-medium text-gray-900 mb-2">Endereço de entrega diferente</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logradouro</label>
              <input
                type="text"
                name="logradouroEntregaDiferente"
                value={formData.logradouroEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="Logradouro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
              <input
                type="text"
                name="numeroEntregaDiferente"
                value={formData.numeroEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="Número"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
              <input
                type="text"
                name="bairroEntregaDiferente"
                value={formData.bairroEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="Bairro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <input
                type="text"
                name="cidadeEntregaDiferente"
                value={formData.cidadeEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="Cidade"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
              <input
                type="text"
                name="cepEntregaDiferente"
                value={formData.cepEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="CEP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <input
                type="text"
                name="estadoEntregaDiferente"
                value={formData.estadoEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="Estado"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
              <input
                type="text"
                name="complementoEntregaDiferente"
                value={formData.complementoEntregaDiferente || ''}
                onChange={handleInputChange}
                placeholder="Complemento"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Botão Calcular frete */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={handleCalcularFrete}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            $ Calcular frete
          </button>
        </div>

        {/* Frete destacado e embutido */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-md">
            <p className="text-sm">Frete destacado</p>
            <p className="text-2xl font-bold">
              R$ {freteDestacado.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div className="bg-blue-900 text-white p-4 rounded-md">
            <p className="text-sm">Frete embutido</p>
            <p className="text-2xl font-bold">
              R$ {freteEmbutido.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


const Step6Contract = ({ formData, setFormData }) => {
  const [clauses, setClauses] = useState([]);
  const [selectedClauses, setSelectedClauses] = useState([]);
  const [customClause, setCustomClause] = useState('');
  const [customClauses, setCustomClauses] = useState([]);

  useEffect(() => {
    // Fetch clauses from backend API
    const fetchClauses = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/clausulas');
        const data = await response.json();
        if (data.clausulas) {
          setClauses(data.clausulas);
          // Initialize selected clauses based on formData.clausulasContrato or all clauses
          if (formData.clausulasContrato && formData.clausulasContrato.length > 0) {
            setSelectedClauses(formData.clausulasContrato);
          } else {
            const allClauseIds = data.clausulas.map(c => c.id);
            setSelectedClauses(allClauseIds);
            setFormData(prev => ({ ...prev, clausulasContrato: allClauseIds }));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar cláusulas:', error);
      }
    };
    fetchClauses();
  }, []);

  const toggleClause = (id) => {
    let updatedSelected;
    if (selectedClauses.includes(id)) {
      updatedSelected = selectedClauses.filter(cid => cid !== id);
    } else {
      updatedSelected = [...selectedClauses, id];
    }
    setSelectedClauses(updatedSelected);
    setFormData(prev => ({ ...prev, clausulasContrato: updatedSelected }));
  };

  const selectAll = () => {
    const allIds = clauses.map(c => c.id);
    setSelectedClauses(allIds);
    setFormData(prev => ({ ...prev, clausulasContrato: allIds }));
  };

  const deselectAll = () => {
    setSelectedClauses([]);
    setFormData(prev => ({ ...prev, clausulasContrato: [] }));
  };

  const handleCustomClauseChange = (e) => {
    setCustomClause(e.target.value);
  };

  const addCustomClause = () => {
    if (customClause.trim() === '') return;
    const updatedCustomClauses = [...customClauses, customClause.trim()];
    setCustomClauses(updatedCustomClauses);
    setCustomClause('');
    setFormData(prev => ({ ...prev, clausulasAvulsas: updatedCustomClauses }));
  };

  const removeCustomClause = (index) => {
    const updatedCustomClauses = customClauses.filter((_, i) => i !== index);
    setCustomClauses(updatedCustomClauses);
    setFormData(prev => ({ ...prev, clausulasAvulsas: updatedCustomClauses }));
  };

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-lg font-medium text-gray-900 mb-4">Cláusulas do contrato :</legend>
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={selectAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Selecionar todos
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Desmarcar todos
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-md p-4">
          {clauses.map(clause => (
            <label key={clause.id} className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedClauses.includes(clause.id)}
                onChange={() => toggleClause(clause.id)}
                className="mt-1"
              />
              <span>{clause.texto}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cláusulas avulsas:</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={customClause}
            onChange={handleCustomClauseChange}
            placeholder="Adicione uma cláusula avulsa para este pedido"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCustomClause}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Adicionar
          </button>
        </div>
        <ul className="list-disc list-inside max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
          {customClauses.map((clause, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{clause}</span>
              <button
                type="button"
                onClick={() => removeCustomClause(index)}
                className="text-red-600 hover:text-red-900 ml-2"
                title="Remover cláusula"
              >
                ✖️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Step7Observations = ({ formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data prevista da decisão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data prevista da decisão: <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dataPrevistaDecisao"
            value={formData.dataPrevistaDecisao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Histórico de negociação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Histórico de negociação:
          </label>
          <textarea
            name="historicoNegociacao"
            value={formData.historicoNegociacao}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Observação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observação:
          </label>
          <textarea
            name="observacao"
            value={formData.observacao}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Observação fiscal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observação fiscal:
          </label>
          <textarea
            name="observacaoFiscal"
            value={formData.observacaoFiscal}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Observação Logistica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observação Logistica:
          </label>
          <textarea
            name="observacaoLogistica"
            value={formData.observacaoLogistica}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>
    </div>
  );
};

const Step8Summary = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resumo do pedido</h2>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <div>
          <h3 className="font-semibold">Orçamento</h3>
          <p>Tipo de cliente: {formData.tipoCliente}</p>
          <p>Setor: {formData.setor}</p>
          <p>Canal de venda: {formData.canalVenda}</p>
          <p>Tipo de venda: {formData.tipoVendaMaterial ? 'Material' : ''} {formData.tipoVendaServico ? 'Serviço' : ''}</p>
          <p>Vendedor: {formData.vendedor}</p>
          <p>Filial: {formData.filial}</p>
          <p>Obra: {formData.obra}</p>
          <p>Orçamentista: {formData.orcamentista}</p>
          <p>Possui especificador: {formData.possuiEspecificador}</p>
          <p>Engenheirado: {formData.engenheirado}</p>
        </div>
        <div>
          <h3 className="font-semibold">Imposto</h3>
          <p>Operação fiscal: {formData.operacaoFiscal}</p>
          <p>Condição de pagamento: {formData.condicaoPagamento}</p>
          <p>Tabela de preço: {formData.tabelaPreco}</p>
          <p>Forma de pagamento: {formData.formaPagamento}</p>
          <p>Contra aviso: {formData.contraAviso}</p>
          <p>Leasing: {formData.leasing}</p>
          <p>Instalação frigorífica: {formData.instalacaoFrigorifica}</p>
          <p>Destinação da mercadoria: {formData.destinacaoMercadoria}</p>
        </div>
        <div>
          <h3 className="font-semibold">Cliente</h3>
          <p>Cliente: {formData.cliente}</p>
          <p>Endereço de entrega: {formData.enderecoEntrega}</p>
          <p>Comprador: {formData.comprador}</p>
          <p>Ordem de compra: {formData.ordemCompra}</p>
          <p>Indicador: {formData.indicador}</p>
          <p>Segmentação: {formData.segmentacao}</p>
          <p>Sub segmentação: {formData.subSegmentacao}</p>
          <p>Micro segmentação: {formData.microSegmentacao}</p>
          <p>Como nos conheceu: {formData.comoConheceu}</p>
        </div>
        <div>
          <h3 className="font-semibold">Itens</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Un.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor de tabela</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acrésc.(%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desc.(%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor de venda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ICMS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.produto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorTabela.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.acrescimo}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.desconto}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatBRL(item.valorVenda)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatBRL(item.valorTotal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.icms}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => {
                        // Edit item: load item data into form for editing
                        // Remove item from list temporarily
                        const itemsCopy = [...formData.items];
                        const index = itemsCopy.findIndex(i => i.id === item.id);
                        if (index !== -1) {
                          itemsCopy.splice(index, 1);
                          setFormData(prev => ({
                            ...prev,
                            items: itemsCopy,
                            // Load item data into form fields for editing
                            searchTerm: item.produto,
                            quantity: item.quantidade,
                            unitMeasure: item.unidade,
                            unitValue: item.valorTabela,
                            observation: item.observacao,
                            discount: item.desconto,
                            discountType: item.descontoType || '%',
                            over: item.acrescimo,
                            overType: item.acrescimoType || '%',
                            indicator: item.indicador,
                            indicatorType: item.indicadorType || '%',
                            icmsPercent: item.icms ? parseFloat(item.icms) : '',
                            showPieceRelation: item.pieceRelation || false,
                            dimensions: item.dimensions || [],
                            currentLength: item.dimensions && item.dimensions.length > 0 ? item.dimensions[0].length.toString() : '',
                            currentPieces: item.dimensions && item.dimensions.length > 0 ? item.dimensions[0].pieces.toString() : '',
                            editIndex: 0
                          }));
                        }
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        // Delete item
                        setFormData(prev => ({
                          ...prev,
                          items: prev.items.filter(i => i.id !== item.id)
                        }));
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Quotations = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tipoCliente: '',
    tipoVendaMaterial: true,
    tipoVendaServico: false,
    setor: '',
    canalVenda: '',
    vendedor: '',
    filial: '',
    obra: '',
    orcamentista: '',
    possuiEspecificador: '',
    engenheirado: '',
    operacaoFiscal: '',
    condicaoPagamento: '',
    tabelaPreco: '',
    formaPagamento: '',
    contraAviso: '',
    leasing: '',
    instalacaoFrigorifica: '',
    destinacaoMercadoria: '',
    cliente: '',
    enderecoEntrega: '',
    comprador: '',
    ordemCompra: '',
    indicador: '',
    indicadorSimNao: 'Não',
    indicadorNome: '',
    contribuinteICMS: 'Não',
    icmsPercent: '',  // Added ICMS percentage field
    segmentacao: '',
    subSegmentacao: '',
    microSegmentacao: '',
    comoConheceu: '',
    preFabricado: '',
    items: [],
    tipoFrete: '',
    percentualEmbutido: '',
    dataDesejadaEmbarque: '',
    dataPrevistaEmbarque: '',
    transportadorRedespacho: '',
    cidadeDiferente: '',
    justificativa: '',
    clausulasContrato: [],
    dataPrevistaDecisao: '',
    historicoNegociacao: '',
    observacao: '',
    observacaoFiscal: '',
    observacaoLogistica: '',
    localizador: ''
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    switch (currentStep) {
      case 1:
        if (!formData.vendedor) newErrors.vendedor = 'Vendedor é obrigatório';
        if (!formData.filial) newErrors.filial = 'Filial é obrigatório';
        if (!formData.condicaoPagamento) newErrors.condicaoPagamento = 'Condição de pagamento é obrigatória';
        if (!formData.formaPagamento) newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
        break;
      case 2:
        // Step 2 (Cliente) - sem validações obrigatórias por enquanto
        break;
      case 3:
        // Step 3 (Itens) - sem validações obrigatórias por enquanto
        break;
      case 4:
        if (!formData.tipoFrete) newErrors.tipoFrete = 'Tipo de frete é obrigatório';
        if (!formData.dataPrevistaEmbarque) newErrors.dataPrevistaEmbarque = 'Data prevista de embarque é obrigatória';
        // Valor de frete é obrigatório apenas para CIF
        if (formData.tipoFrete === 'CIF' && (!formData.valorFrete || formData.valorFrete <= 0)) {
          newErrors.valorFrete = 'Valor de frete é obrigatório para frete CIF';
        }
        break;
      case 6:
        if (!formData.dataPrevistaDecisao) newErrors.dataPrevistaDecisao = 'Data prevista da decisão é obrigatória';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep()) {
      alert('Formulário enviado com sucesso!');
      // Here you can add your form submission logic
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Navigation */}
      <nav className="flex items-center space-x-4 mb-8">
        {STEPS.map(step => (
          <div key={step.id} className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-full cursor-pointer ${
                currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.icon}
            </div>
            <span className={`text-sm font-medium ${currentStep === step.id ? 'text-blue-600' : 'text-gray-600'}`}>
              {step.id}. {step.name}
            </span>
            {step.id < STEPS.length && <span className="text-gray-400"> </span>}
          </div>
        ))}
      </nav>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-md shadow-md">
        {currentStep === 1 && <Step1BudgetTax formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
        {currentStep === 2 && <Step3Client formData={formData} setFormData={setFormData} errors={errors} />}
        {currentStep === 3 && <Step4Items formData={formData} setFormData={setFormData} errors={errors} />}
        {currentStep === 4 && <Step5Freight formData={formData} setFormData={setFormData} />}
        {currentStep === 5 && <Step6Contract formData={formData} setFormData={setFormData} />}
        {currentStep === 6 && <Step7Observations formData={formData} setFormData={setFormData} />}
        {currentStep === 7 && <Step8Summary formData={formData} setFormData={setFormData} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={goToPreviousStep}
            className="bg-yellow-700 text-white py-2 px-6 rounded-md hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Anterior
          </button>
        )}
        {currentStep < STEPS.length && (
          <button
            onClick={goToNextStep}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Próximo
          </button>
        )}
        {currentStep === STEPS.length && (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  );
};

export default Quotations;
