import React, { useState } from 'react';

// Navigation steps configuration
const STEPS = [
  { id: 1, name: 'Orçamento', icon: '📋' },
  { id: 2, name: 'Imposto', icon: '$' },
  { id: 3, name: 'Cliente', icon: '👤' },
  { id: 4, name: 'Itens', icon: '🛍️' },
  { id: 5, name: 'Frete', icon: '🚛' },
  { id: 6, name: 'Contrato', icon: '📝' },
  { id: 7, name: 'Observações', icon: '📋' },
  { id: 8, name: 'Resumo', icon: '📊' }
];

// Step Components
const Step1Budget = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation for required fields in Step 1
    if (name === 'tipoCliente' && !value) {
      setErrors(prev => ({ ...prev, tipoCliente: 'Tipo de cliente é obrigatório' }));
    } else if (name === 'tipoCliente') {
      setErrors(prev => {
        const { tipoCliente, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'setor' && !value) {
      setErrors(prev => ({ ...prev, setor: 'Setor é obrigatório' }));
    } else if (name === 'setor') {
      setErrors(prev => {
        const { setor, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'canalVenda' && !value) {
      setErrors(prev => ({ ...prev, canalVenda: 'Canal de venda é obrigatório' }));
    } else if (name === 'canalVenda') {
      setErrors(prev => {
        const { canalVenda, ...rest } = prev;
        return rest;
      });
    }

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

    if (name === 'possuiEspecificador' && !value) {
      setErrors(prev => ({ ...prev, possuiEspecificador: 'Campo obrigatório' }));
    } else if (name === 'possuiEspecificador') {
      setErrors(prev => {
        const { possuiEspecificador, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'engenheirado' && !value) {
      setErrors(prev => ({ ...prev, engenheirado: 'Campo obrigatório' }));
    } else if (name === 'engenheirado') {
      setErrors(prev => {
        const { engenheirado, ...rest } = prev;
        return rest;
      });
    }
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
            <option value="">Técnico</option>
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
            <option value="">IMP TECNICO</option>
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
            <option value="">101 - ANÁPOLIS/GO</option>
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

const Step5Freight = ({ formData, setFormData }) => {
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
        {/* Tipo de frete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de frete: <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            {['CIF', 'FOB', 'CIP', 'FCA', 'EXW'].map(option => (
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

        {/* Percentual embutido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Percentual embutido: <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="number"
              name="percentualEmbutido"
              value={formData.percentualEmbutido}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2">%</span>
          </div>
        </div>

        {/* Data desejada de embarque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data desejada de embarque: <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dataDesejadaEmbarque"
            value={formData.dataDesejadaEmbarque}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

        {/* Transportador redespacho */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transportador redespacho:
          </label>
          <input
            type="text"
            name="transportadorRedespacho"
            value={formData.transportadorRedespacho}
            onChange={handleInputChange}
            placeholder="Transportador redespacho"
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
                checked={formData.cidadeDiferente === 'Não'}
                onChange={handleInputChange}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Justificativa */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justificativa:
          </label>
          <textarea
            name="justificativa"
            value={formData.justificativa}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botão Calcular frete */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => alert('Calcular frete functionality not implemented')}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            $ Calcular frete
          </button>
        </div>

        {/* Frete destacado e embutido */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-md">
            <p className="text-sm">Frete destacado</p>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
          <div className="bg-blue-900 text-white p-4 rounded-md">
            <p className="text-sm">Frete embutido</p>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step6Contract = ({ formData, setFormData }) => {
  const [clauses, setClauses] = useState([
    { id: 1, text: 'Para um melhor conforto acústico, recomendamos sempre que as Isotelhas® aço x filme sejam instaladas em conjunto com sistema de lajes/forros.', checked: true },
    { id: 2, text: 'Favor conferir todas as informações constantes no pedido.', checked: true },
    { id: 3, text: 'Em caso de desistência do pedido por parte do cliente, será aplicado multa de 20% sobre o valor do pedido.', checked: true },
    { id: 4, text: 'Em caso de não envio do material na data de embarque, por falta de pagamento do contra-aviso, haverá o faturamento imediato da nota, e será cobrado armazenagem diária de 0,1% do valor do pedido.', checked: false },
    { id: 5, text: 'Em caso de não retirada do material produzido até a data de embarque, constante nesse pedido, haverá o faturamento imediato da nota, e será cobrado armazenagem diária de 0,1% do valor do pedido.', checked: false },
    { id: 6, text: 'A descarga dos materiais sempre será responsabilidade do cliente, para frete CIF ou FOB.', checked: true },
    { id: 7, text: 'Informamos de que toda carga nas unidades fabris da Kingspan Isoeste são carregadas com empilhadeira, portanto o transporte tem que ser feito em Truck’s/Carretas abertas.', checked: true },
    { id: 8, text: 'Materiais e montagem da estrutura para sustentação lateral e estrutura para cobertura, são de responsabilidade do cliente;', checked: true },
    { id: 9, text: 'Quando a montagem for de responsabilidade do cliente, os quantitativos dos materiais serão apenas estimativos para composição de orçamento, não tendo valor para produção. A relação final e detalhada dos materiais deverá ser fornecida pelo cliente e caso o valor exceda o que foi orçado, prevalecerá o valor orçado.', checked: true }
  ]);

  const toggleClause = (id) => {
    setClauses(prev =>
      prev.map(clause =>
        clause.id === id ? { ...clause, checked: !clause.checked } : clause
      )
    );
  };

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-lg font-medium text-gray-900 mb-4">Cláusulas do contrato :</legend>
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="selectAll"
              onChange={() => setClauses(clauses.map(c => ({ ...c, checked: true })))}
              className="mr-2"
            />
            Selecionar todos
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="selectAll"
              onChange={() => setClauses(clauses.map(c => ({ ...c, checked: false })))}
              className="mr-2"
            />
            Desmarcar todos
          </label>
        </div>
        <div className="space-y-2">
          {clauses.map(clause => (
            <label key={clause.id} className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={clause.checked}
                onChange={() => toggleClause(clause.id)}
                className="mt-1"
              />
              <span>{clause.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
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

        {/* Localizador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localizador :
          </label>
          <input
            type="text"
            name="localizador"
            value={formData.localizador}
            onChange={handleInputChange}
            placeholder="google.com/maps/@-LATITUDE,-LONGITUDE"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

const Step8Summary = ({ formData }) => {
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
                  <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorVenda.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorTotal.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.icms}</td>
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
    tipoVendaMaterial: false,
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
        if (!formData.tipoCliente) newErrors.tipoCliente = 'Tipo de cliente é obrigatório';
        if (!formData.setor) newErrors.setor = 'Setor é obrigatório';
        if (!formData.canalVenda) newErrors.canalVenda = 'Canal de venda é obrigatório';
        if (!formData.vendedor) newErrors.vendedor = 'Vendedor é obrigatório';
        if (!formData.filial) newErrors.filial = 'Filial é obrigatório';
        if (!formData.possuiEspecificador) newErrors.possuiEspecificador = 'Campo obrigatório';
        if (!formData.engenheirado) newErrors.engenheirado = 'Campo obrigatório';
        break;
      case 2:
        if (!formData.operacaoFiscal) newErrors.operacaoFiscal = 'Operação fiscal é obrigatória';
        if (!formData.condicaoPagamento) newErrors.condicaoPagamento = 'Condição de pagamento é obrigatória';
        if (!formData.tabelaPreco) newErrors.tabelaPreco = 'Tabela de preço é obrigatória';
        if (!formData.formaPagamento) newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
        if (!formData.contraAviso) newErrors.contraAviso = 'Contra aviso é obrigatório';
        if (!formData.leasing) newErrors.leasing = 'Leasing é obrigatório';
        if (!formData.instalacaoFrigorifica) newErrors.instalacaoFrigorifica = 'Instalação frigorífica é obrigatória';
        if (!formData.destinacaoMercadoria) newErrors.destinacaoMercadoria = 'Destinação da mercadoria é obrigatória';
        break;
      case 3:
        if (!formData.enderecoEntrega) newErrors.enderecoEntrega = 'Endereço de entrega é obrigatório';
        if (!formData.indicador) newErrors.indicador = 'Indicador é obrigatório';
        if (!formData.segmentacao) newErrors.segmentacao = 'Segmentação é obrigatória';
        if (!formData.subSegmentacao) newErrors.subSegmentacao = 'Sub segmentação é obrigatória';
        break;
      case 4:
        if (!formData.items || formData.items.length === 0) newErrors.items = 'Adicione pelo menos um item';
        break;
      case 5:
        if (!formData.tipoFrete) newErrors.tipoFrete = 'Tipo de frete é obrigatório';
        if (!formData.percentualEmbutido) newErrors.percentualEmbutido = 'Percentual embutido é obrigatório';
        if (!formData.dataDesejadaEmbarque) newErrors.dataDesejadaEmbarque = 'Data desejada de embarque é obrigatória';
        if (!formData.dataPrevistaEmbarque) newErrors.dataPrevistaEmbarque = 'Data prevista de embarque é obrigatória';
        break;
      case 7:
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
            {step.id < STEPS.length && <span className="text-gray-400"> > </span>}
          </div>
        ))}
      </nav>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-md shadow-md">
        {currentStep === 1 && <Step1Budget formData={formData} setFormData={setFormData} errors={errors} />}
        {currentStep === 2 && <Step2Tax formData={formData} setFormData={setFormData} errors={errors} />}
        {currentStep === 3 && <Step3Client formData={formData} setFormData={setFormData} errors={errors} />}
        {currentStep === 4 && <Step4Items formData={formData} setFormData={setFormData} errors={errors} />}
        {currentStep === 5 && <Step5Freight formData={formData} setFormData={setFormData} />}
        {currentStep === 6 && <Step6Contract formData={formData} setFormData={setFormData} />}
        {currentStep === 7 && <Step7Observations formData={formData} setFormData={setFormData} />}
        {currentStep === 8 && <Step8Summary formData={formData} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={goToPreviousStep}
            className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Anterior
          </button>
        )}
        {currentStep < STEPS.length && (
          <button
            onClick={goToNextStep}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Próximo
          </button>
        )}
        {currentStep === STEPS.length && (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  );
};

const Step2Tax = ({ formData, setFormData, errors }) => {
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
            <option value="">Selecione a operação fiscal</option>
            <option value="VENDA">VENDA</option>
            <option value="REVENDA">REVENDA</option>
            <option value="INDUSTRIALIZAÇÃO">INDUSTRIALIZAÇÃO</option>
          </select>
          {errors.operacaoFiscal && <p className="text-red-500 text-sm mt-1">{errors.operacaoFiscal}</p>}
        </div>

        {/* Condição de pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condição de pagamento: <span className="text-red-500">*</span>
          </label>
          <select
            name="condicaoPagamento"
            value={formData.condicaoPagamento}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a condição</option>
            <option value="À VISTA">À VISTA</option>
            <option value="30 DIAS">30 DIAS</option>
            <option value="60 DIAS">60 DIAS</option>
            <option value="90 DIAS">90 DIAS</option>
          </select>
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
            <option value="TABELA A">TABELA A</option>
            <option value="TABELA B">TABELA B</option>
            <option value="TABELA C">TABELA C</option>
          </select>
          {errors.tabelaPreco && <p className="text-red-500 text-sm mt-1">{errors.tabelaPreco}</p>}
        </div>

        {/* Forma de pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Forma de pagamento: <span className="text-red-500">*</span>
          </label>
          <select
            name="formaPagamento"
            value={formData.formaPagamento}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a forma</option>
            <option value="DINHEIRO">DINHEIRO</option>
            <option value="CARTÃO">CARTÃO</option>
            <option value="BOLETO">BOLETO</option>
            <option value="TRANSFERÊNCIA">TRANSFERÊNCIA</option>
          </select>
          {errors.formaPagamento && <p className="text-red-500 text-sm mt-1">{errors.formaPagamento}</p>}
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
          {errors.contraAviso && <p className="text-red-500 text-sm mt-1">{errors.contraAviso}</p>}
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
          {errors.leasing && <p className="text-red-500 text-sm mt-1">{errors.leasing}</p>}
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
          {errors.instalacaoFrigorifica && <p className="text-red-500 text-sm mt-1">{errors.instalacaoFrigorifica}</p>}
        </div>

        {/* Destinação da mercadoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinação da mercadoria: <span className="text-red-500">*</span>
          </label>
          <select
            name="destinacaoMercadoria"
            value={formData.destinacaoMercadoria}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione a destinação</option>
            <option value="CONSUMO">CONSUMO</option>
            <option value="REVENDA">REVENDA</option>
            <option value="INDUSTRIALIZAÇÃO">INDUSTRIALIZAÇÃO</option>
          </select>
          {errors.destinacaoMercadoria && <p className="text-red-500 text-sm mt-1">{errors.destinacaoMercadoria}</p>}
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço de entrega: <span className="text-red-500">*</span>
          </label>
          <select
            name="enderecoEntrega"
            value={formData.enderecoEntrega}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Cristalina/GO, ROD BR 040, A DIREITA, FAZ CRISTAL, SN - ZONA RURAL</option>
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
            <option value="">AGRONEGÓCIO</option>
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
            <option value="">PRODUTOR</option>
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
            <option value="">Já sou um cliente</option>
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
      items: [...(prev.items || []), newItem]
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pré-Fabricado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pré-Fabricado:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="preFabricado"
                value="Sim"
                checked={formData.preFabricado === 'Sim'}
                onChange={(e) => setFormData(prev => ({ ...prev, preFabricado: e.target.value }))}
                className="mr-2"
              />
              Sim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="preFabricado"
                value="Não"
                checked={formData.preFabricado === 'Não'}
                onChange={(e) => setFormData(prev => ({ ...prev, preFabricado: e.target.value }))}
                className="mr-2"
              />
              Não
            </label>
          </div>
        </div>

        {/* Item Search */}
        <div className="md:col-span-2">
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              🔍
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              📋 Prédio
            </button>
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade: <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Valor Unitário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Unitário: <span className="text-red-500">*</span>
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

        {/* Observação */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observação:
          </label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Desconto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desconto (%):
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Acréscimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Acréscimo (%):
          </label>
          <input
            type="number"
            value={increase}
            onChange={(e) => setIncrease(parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botão Adicionar Item */}
        <div className="md:col-span-2">
          <button
            onClick={handleAddItem}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            + Incluir
          </button>
        </div>
      </div>

      {/* Tabela de Itens */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Itens adicionados</h3>
        <div className="overflow-x-auto">
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
                  <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorVenda.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">R$ {item.valorTotal.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.icms}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remover
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

export default Quotations;
