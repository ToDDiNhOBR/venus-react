import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchForm, setSearchForm] = useState({
    code: '',
    cpfCnpj: '',
    name: '',
    representative: '1638 - PEDRO PAULO',
    sector: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Remove dropdown state and ref
  const [tooltip, setTooltip] = useState(null);
  const [tooltipClientId, setTooltipClientId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [clientToView, setClientToView] = useState(null);

  // Remove useEffect for dropdown click outside

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchClients = async (params) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:5002/api/clients?${query}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }
      const data = await response.json();
      // Map clients to normalize property names expected in UI
      const normalizedClients = (data.clients || []).map(client => ({
        ...client,
        representative: client.representante || client.representative || '',
        sector: client.setor || client.sector || '',
        address: client.endereco || client.address || '',
        phone: client.telefone || client.phone || '',
        celular: client.celular || client.phone || '', // for table celular
        cidade: client.cidade || '',
        estado: client.estado || '',
      }));
      setClients(normalizedClients);
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
    if (!searchForm.sector) {
      setError('O setor é obrigatório para a busca.');
      return;
    }
    fetchClients(searchForm);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/clients/${clientToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao apagar cliente');
      }
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setShowDeleteModal(false);
      setClientToDelete(null);
      alert('Cliente apagado com sucesso.');
    } catch (error) {
      alert('Erro ao apagar cliente. Por favor, tente novamente.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  // Remove handleRegisterOption function as dropdown is removed

  const handleEditClick = (client) => {
    navigate(`/admin/clients/register/${client.code}`);
  };

  const handleViewClick = (client) => {
    setClientToView(client);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setClientToView(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold border-l-4 border-blue-600 pl-4">
          Consultar cliente
        </h2>
        <button
          onClick={() => navigate('/admin/clients/register')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Cadastrar cliente
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código do cliente</label>
            <input
              type="text"
              name="code"
              value={searchForm.code}
              onChange={handleSearchChange}
              placeholder="Informe um código"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input
              type="text"
              name="cpfCnpj"
              value={searchForm.cpfCnpj}
              onChange={handleSearchChange}
              placeholder="Informe CPF/CNPJ"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={searchForm.name}
              onChange={handleSearchChange}
              placeholder="Informe um nome"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Representante</label>
            <select
              name="representative"
              value={searchForm.representative}
              onChange={handleSearchChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione um representante</option>
              <option value="1638 - PEDRO PAULO">1638 - PEDRO PAULO</option>
              <option value="1639 - MARIA SILVA">1639 - MARIA SILVA</option>
              <option value="1640 - JOÃO PEREIRA">1640 - JOÃO PEREIRA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Setor <span className="text-red-500">*</span></label>
            <select
              name="sector"
              value={searchForm.sector}
              onChange={handleSearchChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione um setor</option>
              <option value="Técnico">Técnico</option>
              <option value="Comercial">Comercial</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </div>
          <div className="md:col-span-5 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <span>{loading ? 'Buscando...' : 'Buscar'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
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
                    <td className="px-6 py-4 whitespace-nowrap">{client.cidade && client.estado ? `${client.cidade}/${client.estado}` : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.celular || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 relative">
                      <button
                        onMouseEnter={() => {
                          setTooltip('edit');
                          setTooltipClientId(client.id);
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          setTooltipClientId(null);
                        }}
                        onClick={() => handleEditClick(client)}
                        className="text-blue-600 hover:text-blue-900 relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        {tooltip === 'edit' && tooltipClientId === client.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                            Editar cadastro do cliente
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </button>
                      <button
                        onMouseEnter={() => {
                          setTooltip('view');
                          setTooltipClientId(client.id);
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          setTooltipClientId(null);
                        }}
                        onClick={() => handleViewClick(client)}
                        className="text-blue-600 hover:text-blue-900 relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {tooltip === 'view' && tooltipClientId === client.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                            Visualizar cadastro do cliente
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(client)}
                        onMouseEnter={() => {
                          setTooltip('delete');
                          setTooltipClientId(client.id);
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          setTooltipClientId(null);
                        }}
                        className="text-red-600 hover:text-red-900 relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {tooltip === 'delete' && tooltipClientId === client.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                            Apagar Cadastro
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showViewModal && clientToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Detalhes do Cliente</h3>
            <button
              onClick={closeViewModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="space-y-2 text-sm">
              <p><strong>Código:</strong> {clientToView.code}</p>
              <p><strong>CPF/CNPJ:</strong> {clientToView.cpfCnpj}</p>
              <p><strong>Nome:</strong> {clientToView.name}</p>
              <p><strong>Representante:</strong> {clientToView.representative}</p>
              <p><strong>Setor:</strong> {clientToView.sector}</p>
              <p><strong>Contribuinte ICMS:</strong> {clientToView.contribuinteICMS || 'Não'}</p>
              <p><strong>Endereço:</strong> {clientToView.cidade && clientToView.estado ? `${clientToView.cidade}/${clientToView.estado}` : ''}</p>
              <p><strong>Inscrição Estadual:</strong> {clientToView.inscricaoEstadual}</p>
              <p><strong>Inscrição Municipal:</strong> {clientToView.inscricaoMunicipal}</p>
              <p><strong>Telefone:</strong> {clientToView.phone}</p>
              <p><strong>Email:</strong> {clientToView.email}</p>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}

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

export default ClientManagement;
