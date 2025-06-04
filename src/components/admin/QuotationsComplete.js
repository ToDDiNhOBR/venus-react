import React, { useState, useEffect } from 'react';

// Step Components
const Step1Budget = ({ formData, setFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de cliente: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tipoCliente"
                value="Cliente"
                checked={formData.tipoCliente === 'Cliente'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Cliente
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tipoCliente"
                value="Prospect"
                checked={formData.tipoCliente === 'Prospect'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Prospect
            </label>
          </div>
          {errors.tipoCliente && <p className="text-red-500 text-sm mt-1">{errors.tipoCliente}</p>}
        </div>

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

        {/* Setor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Setor: <span className="text-red-500">*</span>
          </label>
          <select
            name="setor"
            value={formData.setor}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o setor</option>
            <option value="Técnico">Técnico</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
          </select>
          {errors.setor && <p className="text-red-500 text-sm mt-1">{errors.setor}</p>}
        </div>

        {/* Canal de venda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canal de venda: <span className="text-red-500">*</span>
          </label>
          <select
            name="canalVenda"
            value={formData.canalVenda}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o canal</option>
            <option value="IMP TECNICO">IMP TECNICO</option>
            <option value="DIRETO">DIRETO</option>
            <option value="REPRESENTANTE">REPRESENTANTE</option>
          </select>
          {errors.canalVenda && <p className="text-red-500 text-sm mt-1">{errors.canalVenda}</p>}
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
            <option value="">Selecione a filial</option>
            <option value="101 - ANÁPOLIS/GO">101 - ANÁPOLIS/GO</option>
            <option value="102 - GOIÂNIA/GO">102 - GOIÂNIA/GO</option>
            <option value="103 - BRASÍLIA/DF">103 - BRASÍLIA/DF</option>
          </select>
          {errors.filial && <p className="text-red-500 text-sm mt-1">{errors.filial}</p>}
        </div>

        {/* Obra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Obra:
          </label>
          <input
            type="text"
            name="obra"
            value={formData.obra}
            onChange={handleInputChange}
            placeholder="Nome da obra"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Orçamentista */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orçamentista:
          </label>
          <select
            name="orcamentista"
            value={formData.orcamentista}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Nome do orçamentista</option>
            <option value="João Silva">João Silva</option>
            <option value="Maria Santos">Maria Santos</option>
          </select>
        </div>

        {/* Possui especificador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Possui especificador: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="possuiEspecificador"
                value="Sim"
                checked={formData.possuiEspecificador === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="possuiEspecificador"
                value="Não"
                checked={formData.possuiEspecificador === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Engenheirado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engenheirado: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="engenheirado"
                value="Sim"
                checked={formData.engenheirado === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="engenheirado"
                value="Não"
                checked={formData.engenheirado === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step2Tax = ({ formData, setFormData, errors }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operação fiscal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operação fiscal: <span className="text-red-500">*</span>
          </label>
          <select
            name="operacaoFiscal"
            value={formData.operacaoFiscal}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a operação</option>
            <option value="1 - VENDA NORMAL">1 - VENDA NORMAL</option>
            <option value="2 - VENDA INTERESTADUAL">2 - VENDA INTERESTADUAL</option>
          </select>
          {errors.operacaoFiscal && <p className="text-red-500 text-sm mt-1">{errors.operacaoFiscal}</p>}
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
            placeholder="0 - MANUAL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.condicaoPagamento && <p className="text-red-500 text-sm mt-1">{errors.condicaoPagamento}</p>}
        </div>

        {/* Tabela de preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tabela de preço: <span className="text-red-500">*</span>
          </label>
          <select
            name="tabelaPreco"
            value={formData.tabelaPreco}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a tabela</option>
            <option value="VTBASE - TABELA PREÇO PADRÃO - GO">VTBASE - TABELA PREÇO PADRÃO - GO</option>
            <option value="VTPROM - TABELA PROMOCIONAL - GO">VTPROM - TABELA PROMOCIONAL - GO</option>
          </select>
          {errors.tabelaPreco && <p className="text-red-500 text-sm mt-1">{errors.tabelaPreco}</p>}
        </div>

        {/* Forma de pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Forma de pagamento: <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Boleto bancário"
                checked={formData.formaPagamento === 'Boleto bancário'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Boleto bancário
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Cartão BNDES"
                checked={formData.formaPagamento === 'Cartão BNDES'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Cartão BNDES
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Cartão Presencial"
                checked={formData.formaPagamento === 'Cartão Presencial'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Cartão Presencial
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Depósito"
                checked={formData.formaPagamento === 'Depósito'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Depósito
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Venda Finame"
                checked={formData.formaPagamento === 'Venda Finame'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Venda Finame
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Link de Pagamento"
                checked={formData.formaPagamento === 'Link de Pagamento'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Link de Pagamento
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Cheque Moradia"
                checked={formData.formaPagamento === 'Cheque Moradia'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Cheque Moradia
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="formaPagamento"
                value="Sinal depósito + boletos"
                checked={formData.formaPagamento === 'Sinal depósito + boletos'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sinal depósito + boletos
            </label>
          </div>
        </div>

        {/* Contra aviso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contra aviso: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="contraAviso"
                value="Sim"
                checked={formData.contraAviso === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contraAviso"
                value="Não"
                checked={formData.contraAviso === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Leasing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leasing: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="leasing"
                value="Sim"
                checked={formData.leasing === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="leasing"
                value="Não"
                checked={formData.leasing === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Instalação frigorífica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instalação frigorífica: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="instalacaoFrigorifica"
                value="Sim"
                checked={formData.instalacaoFrigorifica === 'Sim'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="instalacaoFrigorifica"
                value="Não"
                checked={formData.instalacaoFrigorifica === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Destinação da mercadoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinação da mercadoria: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="destinacaoMercadoria"
                value="Consumo/Ativo"
                checked={formData.destinacaoMercadoria === 'Consumo/Ativo'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Consumo/Ativo
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="destinacaoMercadoria"
                value="Comércio/Indústria"
                checked={formData.destinacaoMercadoria === 'Comércio/Indústria'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Comércio/Indústria
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3 - Cliente
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
        <div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço de entrega: <span className="text-red-500">*</span>
          </label>
          <select
            name="enderecoEntrega"
            value={formData.enderecoEntrega}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o endereço</option>
            <option value="Cristalina/GO, ROD BR 040, A DIREITA, FAZ CRISTAL, SN - ZONA RURAL">
              Cristalina/GO, ROD BR 040, A DIREITA, FAZ CRISTAL, SN - ZONA RURAL
            </option>
          </select>
          {errors.enderecoEntrega && <p className="text-red-500 text-sm mt-1">{errors.enderecoEntrega}</p>}
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

        {/* Indicador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indicador: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="indicador"
            value={formData.indicador}
            onChange={handleInputChange}
            placeholder="9 - SEM INDICADOR"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Segmentação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Segmentação: <span className="text-red-500">*</span>
          </label>
          <select
            name="segmentacao"
            value={formData.segmentacao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a segmentação</option>
            <option value="AGRONEGÓCIO">AGRONEGÓCIO</option>
            <option value="CONSTRUÇÃO CIVIL">CONSTRUÇÃO CIVIL</option>
            <option value="INDÚSTRIA">INDÚSTRIA</option>
          </select>
        </div>

        {/* Sub segmentação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub segmentação: <span className="text-red-500">*</span>
          </label>
          <select
            name="subSegmentacao"
            value={formData.subSegmentacao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a sub segmentação</option>
            <option value="PRODUTOR">PRODUTOR</option>
            <option value="COOPERATIVA">COOPERATIVA</option>
            <option value="DISTRIBUIDOR">DISTRIBUIDOR</option>
          </select>
        </div>

        {/* Micro segmentação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Micro segmentação:
          </label>
          <select
            name="microSegmentacao"
            value={formData.microSegmentacao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a micro segmentação</option>
            <option value="PEQUENO">PEQUENO</option>
            <option value="MÉDIO">MÉDIO</option>
            <option value="GRANDE">GRANDE</option>
          </select>
        </div>

        {/* Como nos conheceu */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Como nos conheceu?
          </label>
          <select
            name="comoConheceu"
            value={formData.comoConheceu}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma opção</option>
            <option value="Já sou um cliente">Já sou um cliente</option>
            <option value="Indicação">Indicação</option>
            <option value="Internet">Internet</option>
            <option value="Feira/Evento">Feira/Evento</option>
            <option value="Representante">Representante</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Step 4 - Itens
const Step4Items = ({ formData, setFormData, errors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitValue, setUnitValue] = useState('');
  const [observation, setObservation] = useState('');
  const [discount, setDiscount] = useState(0);
  const [increase, setIncrease] = useState(0);

  const handleAddItem = () => {
    if (!searchTerm || !quantity || !unitValue) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const newItem = {
      id: Date.now(),
      produto: searchTerm,
      quantidade: parseFloat(quantity),
      unidade: 'Pç',
      valorTabela: parseFloat(unitValue),
      acrescimo: increase,
      desconto: discount,
      valorVenda: parseFloat(unitValue) * (1 + increase/100) * (1 - discount/100),
      valorTotal: parseFloat(quantity) * parseFloat(unitValue) * (1 + increase/100) * (1 - discount/100),
      icms: '10%',
      observacao: observation
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset form
    setSearchTerm('');
    setQuantity('');
    setUnitValue('');
    setObservation('');
    setDiscount(0);
    setIncrease(0);
  };

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const applyDiscountIncrease = () => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => ({
        ...item,
        acrescimo: increase,
        desconto: discount,
        valorVenda: item.valorTabela * (1 + increase/100) * (1 - discount/100),
        valorTotal: item.quantidade * item.valorTabela * (1 + increase/100) * (1 - discount/100)
      }))
    }));
  };

  return (
    <div className="space-y-6">
      {/* Pré-Fabricado e Item */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pré-Fabricado:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="preFabricado" value="Sim" className="mr-2" />
              Sim
            </label>
            <label className="flex items-center">
              <input type="radio" name="preFabricado" value="Não" defaultChecked className="mr-2" />
              Não
            </label>
          </div>
        </div>
