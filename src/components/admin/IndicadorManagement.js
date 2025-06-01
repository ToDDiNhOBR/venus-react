import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IndicadorManagement = () => {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState([]);
  const [searchForm, setSearchForm] = useState({
    code: '',
    cpfCnpj: '',
    name: '',
    representative: '',
    sector: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipClientId, setTooltipClientId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [indicadorToDelete, setIndicadorToDelete] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [indicadorToView, setIndicadorToView] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Utility function to format Brazilian phone numbers
  const formatBrazilianPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      // Mobile format: (XX) 9XXXX-XXXX
      return cleaned.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
    } else if (cleaned.length === 10) {
      // Landline format: (XX) XXXX-XXXX
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
      return phone; // Return as is if length doesn't match
    }
  };

  const fetchIndicadores = async (params) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:5002/api/indicador?${query}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar indicadores');
      }
      const data = await response.json();
      const normalizedIndicadores = (data.indicadores || data.indicador || []).map(indicador => ({
        ...indicador,
        representative: indicador.representante || indicador.representative || '',
        sector: indicador.setor || indicador.sector || '',
        address: indicador.endereco || indicador.address || '',
        phone: formatBrazilianPhone(indicador.telefone || indicador.phone || ''),
        celular: formatBrazilianPhone(indicador.celular || indicador.phone || ''),
        cidade: indicador.cidade || '',
        estado: indicador.estado || '',
      }));
      setIndicadores(normalizedIndicadores);
      setHasSearched(true);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      setIndicadores([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    if (!searchForm.sector) {
      setError('O campo Setor é obrigatório para a busca.');
      setIndicadores([]);
      setHasSearched(false);
      return;
    }
    fetchIndicadores(searchForm);
  };

  const handleDeleteClick = (indicador) => {
    setIndicadorToDelete(indicador);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/indicador/${indicadorToDelete.code}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao apagar indicador');
      }
      setIndicadores(indicadores.filter(i => i.code !== indicadorToDelete.code));
      setShowDeleteModal(false);
      setIndicadorToDelete(null);
    } catch (error) {
      alert('Erro ao apagar indicador. Por favor, tente novamente.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIndicadorToDelete(null);
  };

  const handleRegisterOption = (option) => {
    setShowDropdown(false);
    if (option === 'blank') {
      navigate('/admin/indicador/register');
    }
  };

  const handleEditClick = (indicador) => {
    navigate(`/admin/indicador/register/${indicador.code}`);
  };

  const handleViewClick = (indicador) => {
    setIndicadorToView(indicador);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setIndicadorToView(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold border-l-4 border-purple-600 pl-4">
          Consultar indicador
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
          >
            Cadastrar indicador
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => handleRegisterOption('blank')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Cadastro em branco
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código do indicador</label>
            <input
              type="text"
              name="code"
              value={searchForm.code}
              onChange={handleSearchChange}
              placeholder="Informe um código"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Representante</label>
            <select
              name="representative"
              value={searchForm.representative}
              onChange={handleSearchChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Selecione um representante</option>
              <option value="Representante 1">Representante 1</option>
              <option value="Representante 2">Representante 2</option>
              <option value="Representante 3">Representante 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Setor <span className="text-red-600">*</span>
            </label>
            <select
              name="sector"
              value={searchForm.sector}
              onChange={handleSearchChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="">Selecione um setor</option>
              <option value="Comercial">Comercial</option>
              <option value="Técnico">Técnico</option>
            </select>
          </div>
          <div className="md:col-span-5 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-gray-200">Lista de indicadores</h3>
        {error && <p className="text-red-600 p-4">{error}</p>}
        {!error && indicadores.length === 0 && !loading && hasSearched && (
          <p className="p-4 text-gray-500">Nenhum indicador encontrado.</p>
        )}
        {hasSearched && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">CPF/CNPJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Representante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Setor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {indicadores.map((indicador) => (
                  <tr key={indicador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{indicador.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{indicador.cpfCnpj}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{indicador.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{indicador.representative}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{indicador.sector}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{indicador.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3 relative">
                      <button
                        onMouseEnter={() => {
                          setTooltip('edit');
                          setTooltipClientId(indicador.id);
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          setTooltipClientId(null);
                        }}
                        onClick={() => handleEditClick(indicador)}
                        className="text-blue-600 hover:text-blue-900 relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        {tooltip === 'edit' && tooltipClientId === indicador.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                            Editar cadastro do indicador
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </button>
                      <button
                        onMouseEnter={() => {
                          setTooltip('view');
                          setTooltipClientId(indicador.id);
                        }}
                        onMouseLeave={() => {
                          setTooltip(null);
                          setTooltipClientId(null);
                        }}
                        onClick={() => handleViewClick(indicador)}
                        className="text-blue-600 hover:text-blue-900 relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {tooltip === 'view' && tooltipClientId === indicador.id && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                            Visualizar cadastro do indicador
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(indicador)}
                        onMouseEnter={() => {
                          setTooltip('delete');
                          setTooltipClientId(indicador.id);
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
                        {tooltip === 'delete' && tooltipClientId === indicador.id && (
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

      {showViewModal && indicadorToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Detalhes do Indicador</h3>
            <button
              onClick={closeViewModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              aria-label="Fechar"
            >
              &times;
            </button>
            <div className="space-y-2 text-sm">
              <p><strong>Código:</strong> {indicadorToView.code}</p>
              <p><strong>CPF/CNPJ:</strong> {indicadorToView.cpfCnpj}</p>
              <p><strong>Nome:</strong> {indicadorToView.name}</p>
              <p><strong>Representante:</strong> {indicadorToView.representative}</p>
              <p><strong>Setor:</strong> {indicadorToView.sector}</p>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && indicadorToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir o indicador <strong>{indicadorToDelete.name}</strong>?</p>
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

export default IndicadorManagement;
