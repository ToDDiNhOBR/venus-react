import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [searchCpfCnpj, setSearchCpfCnpj] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchRepresentative, setSearchRepresentative] = useState('1638 - PEDRO PAULO');
  const [searchSector, setSearchSector] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const fetchClients = async (params) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:5000/api/clients?${query}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }
      const data = await response.json();
      setClients(data.clients || []);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      setClients([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    if (!searchSector) {
      setError('O setor é obrigatório para a busca.');
      return;
    }
    const params = {
      code: searchCode,
      cpfCnpj: searchCpfCnpj,
      name: searchName,
      representative: searchRepresentative,
      sector: searchSector,
    };
    fetchClients(params);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${encodeURIComponent(clientToDelete.code)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao apagar cliente');
      }
      setClients(clients.filter(c => c.code !== clientToDelete.code));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      alert('Erro ao apagar cliente. Por favor, tente novamente.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const handleEditClick = (client) => {
    navigate(`/admin/clients/register/${client.code}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold border-l-4 border-blue-600 pl-4 mb-4">
        Consultar cliente
      </h2>

      <div className="bg-white shadow rounded-lg p-6">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={handleSearch}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Código do cliente</label>
            <input
              type="text"
              placeholder="Informe um código"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input
              type="text"
              placeholder="Informe um CPF/CNPJ"
              value={searchCpfCnpj}
              onChange={(e) => setSearchCpfCnpj(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              placeholder="Informe um nome"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Representante<span className="text-red-500">*</span></label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={searchRepresentative}
              onChange={(e) => setSearchRepresentative(e.target.value)}
            >
              <option>1638 - PEDRO PAULO</option>
              <option>1639 - MARIA SILVA</option>
              <option>1640 - JOÃO PEREIRA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Setor<span className="text-red-500">*</span></label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={searchSector}
              onChange={(e) => setSearchSector(e.target.value)}
              required
            >
              <option value="">Selecione um setor</option>
              <option>Técnico</option>
              <option>Comercial</option>
              <option>Financeiro</option>
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="md:col-span-5 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'} &#128269;
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-gray-200">Lista de clientes</h3>
        {error && <p className="text-red-600 p-4">{error}</p>}
        {!error && clients.length === 0 && !loading && hasSearched && (
          <p className="p-4 text-gray-500">Nenhum cliente encontrado.</p>
        )}
        {hasSearched && (
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
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{client.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.cpfCnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.cidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.telefone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 relative">
                    <button
                      onClick={() => handleEditClick(client)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Orçamentos</button>
                    <button
                      onClick={() => handleDeleteClick(client)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir o cliente <strong>{clientToDelete.name}</strong>?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
