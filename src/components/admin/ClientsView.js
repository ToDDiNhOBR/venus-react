import React, { useState } from 'react';

const ClientsView = () => {
  const [clients] = useState([
    {
      id: 1,
      code: '243544',
      cpfCnpj: '044.482.091-**',
      name: 'PEDRO PAULO VIEIRA RESENDE',
      location: 'PATOS DE MINAS/MG',
      phone: '62 9 9657 0077;',
      email: 'pe********@termogoias.com.br',
      status: 'Ativo',
      representative: '1638 - PEDRO PAULO',
      sector: 'Técnico',
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold border-l-4 border-blue-600 pl-4">
          Consultar cliente
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Cadastrar cliente
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código do cliente</label>
            <input
              type="text"
              placeholder="Informe um código"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input
              type="text"
              value="044.482.091-48"
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              placeholder="Informe um nome"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Representante<span className="text-red-500">*</span></label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="1638 - PEDRO PAULO"
            >
              <option>1638 - PEDRO PAULO</option>
              <option>1639 - MARIA SILVA</option>
              <option>1640 - JOÃO PEREIRA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Setor</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="Técnico"
            >
              <option>Técnico</option>
              <option>Comercial</option>
              <option>Financeiro</option>
            </select>
          </div>
          <div className="md:col-span-5 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <span>Buscar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-gray-200">Lista de clientes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yellow-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">CPF/CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Localidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{client.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.cpfCnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button title="Editar cadastro do cliente" className="text-blue-600 hover:text-blue-900 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button title="Salvar cadastro do cliente" className="text-blue-600 hover:text-blue-900 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button title="Excluir cadastro do cliente" className="text-red-600 hover:text-red-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
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

export default ClientsView;
