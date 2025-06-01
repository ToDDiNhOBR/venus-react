import React from 'react';

const Reports = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Relatórios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vendas Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Relatório de Vendas</h3>
          <p className="text-gray-600 mb-4">Visualize o desempenho de vendas por período</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Gerar Relatório
          </button>
        </div>

        {/* Orçamentos Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Orçamentos</h3>
          <p className="text-gray-600 mb-4">Acompanhe os orçamentos realizados</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Gerar Relatório
          </button>
        </div>

        {/* Produtos Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Produtos</h3>
          <p className="text-gray-600 mb-4">Análise de estoque e movimentação</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Gerar Relatório
          </button>
        </div>

        {/* Colaboradores Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Colaboradores</h3>
          <p className="text-gray-600 mb-4">Desempenho e atividades da equipe</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Gerar Relatório
          </button>
        </div>

        {/* Clientes Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Clientes</h3>
          <p className="text-gray-600 mb-4">Análise de clientes e vendas</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Gerar Relatório
          </button>
        </div>

        {/* Financeiro Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Financeiro</h3>
          <p className="text-gray-600 mb-4">Resumo financeiro e projeções</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
