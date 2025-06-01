import React, { useState } from 'react';

const Quotations = () => {
  const [quotations] = useState([
    {
      id: 1,
      client: 'Empresa ABC',
      date: '2024-01-20',
      status: 'Pendente',
      total: 'R$ 15.000,00'
    },
    {
      id: 2,
      client: 'Construtora XYZ',
      date: '2024-01-19',
      status: 'Aprovado',
      total: 'R$ 28.500,00'
    }
  ]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Orçamentos</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Novo Orçamento
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotations.map((quotation) => (
              <tr key={quotation.id}>
                <td className="px-6 py-4 whitespace-nowrap">{quotation.client}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quotation.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    quotation.status === 'Aprovado' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quotation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{quotation.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">PDF</button>
                  <button className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quotations;
