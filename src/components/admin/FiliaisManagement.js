import React, { useState, useEffect, useRef } from 'react';

const FiliaisManagement = () => {
  const [filiais, setFiliais] = useState([]);
  const [filteredFiliais, setFilteredFiliais] = useState([]);
  const [selectedFilial, setSelectedFilial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const filiaisPerPage = 10;

  const listRef = useRef(null);

  useEffect(() => {
    fetchFiliais();
  }, []);

  useEffect(() => {
    filterFiliais();
  }, [searchTerm, filiais]);

  const fetchFiliais = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5002/api/admin/filiais');
      if (!response.ok) {
        throw new Error('Erro ao buscar filiais');
      }
      const data = await response.json();
      const normalizedFiliais = (data.filiais || []).map(filial => ({
        id: filial.id || filial.code || '',
        code: filial.code || filial.id || '',
        nome: filial.nome || filial.name || '',
        cnpj: filial.cnpj || '',
        inscricaoEstadual: filial.inscricaoEstadual || '',
        inscricaoMunicipal: filial.inscricaoMunicipal || '',
        cep: filial.cep || '',
        logradouro: filial.logradouro || '',
        numero: filial.numero || '',
        complemento: filial.complemento || '',
        bairro: filial.bairro || '',
        cidade: filial.cidade || '',
        uf: filial.uf || filial.estado || '',
        telefone: filial.telefone || '',
        email: filial.email || '',
        filial: filial.filial || '',
      }));
      setFiliais(normalizedFiliais);
      if (normalizedFiliais.length > 0) {
        setSelectedFilial(normalizedFiliais[0]);
      }
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const filterFiliais = () => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = filiais.filter(f => {
      return (
        f.nome.toLowerCase().includes(lowerTerm) ||
        f.code.toLowerCase().includes(lowerTerm) ||
        f.cnpj.toLowerCase().includes(lowerTerm) ||
        f.cidade.toLowerCase().includes(lowerTerm) ||
        f.uf.toLowerCase().includes(lowerTerm)
      );
    });
    setFilteredFiliais(filtered);
    if (filtered.length > 0) {
      setSelectedFilial(filtered[0]);
    } else {
      setSelectedFilial(null);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectFilial = (filial) => {
    setSelectedFilial(filial);
  };

  // Pagination
  const indexOfLast = currentPage * filiaisPerPage;
  const indexOfFirst = indexOfLast - filiaisPerPage;
  const currentFiliais = filteredFiliais.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFiliais.length / filiaisPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 h-full">
      {/* Filiais List */}
      <div className="md:w-1/3 bg-white rounded-lg shadow p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filiais</h2>
        </div>
        <input
          type="text"
          placeholder="Buscar filiais..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {loading ? (
          <p>Carregando filiais...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : currentFiliais.length === 0 ? (
          <p>Nenhuma filial encontrada.</p>
        ) : (
          <ul ref={listRef} className="overflow-y-auto flex-grow divide-y divide-gray-200">
            {currentFiliais.map(filial => (
              <li
                key={filial.code}
                onClick={() => handleSelectFilial(filial)}
                className={`cursor-pointer p-3 hover:bg-green-50 rounded ${
                  selectedFilial && selectedFilial.code === filial.code ? "bg-green-100" : ""
                }`}
              >
                <div className="font-semibold">{filial.nome}</div>
                <div className="text-sm text-gray-600">{filial.cnpj}</div>
                <div className="text-sm text-gray-600">{filial.cidade} - {filial.uf}</div>
              </li>
            ))}
          </ul>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filial Detail Panel */}
      <div className="md:w-2/3 bg-white rounded-lg shadow p-6 flex flex-col">
        {selectedFilial ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Detalhes da Filial</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-gray-700">Código</label>
                <p>{selectedFilial.code}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Nome</label>
                <p>{selectedFilial.nome}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">CNPJ</label>
                <p>{selectedFilial.cnpj}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Inscrição Estadual</label>
                <p>{selectedFilial.inscricaoEstadual}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Inscrição Municipal</label>
                <p>{selectedFilial.inscricaoMunicipal}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">CEP</label>
                <p>{selectedFilial.cep}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Logradouro</label>
                <p>{selectedFilial.logradouro}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Número</label>
                <p>{selectedFilial.numero}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Complemento</label>
                <p>{selectedFilial.complemento}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Bairro</label>
                <p>{selectedFilial.bairro}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Cidade</label>
                <p>{selectedFilial.cidade}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">UF</label>
                <p>{selectedFilial.uf}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Telefone</label>
                <p>{selectedFilial.telefone}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <p>{selectedFilial.email}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Filial</label>
                <p>{selectedFilial.filial}</p>
              </div>
            </div>
          </>
        ) : (
          <p>Selecione uma filial para ver os detalhes.</p>
        )}
      </div>
    </div>
  );
};

export default FiliaisManagement;
