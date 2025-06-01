import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProspectManagement = () => {
  const navigate = useNavigate();
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState(''); // New state for tag color filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prospectToDelete, setProspectToDelete] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const prospectsPerPage = 10;

  const listRef = useRef(null);

  useEffect(() => {
    fetchProspects();
  }, []);

  useEffect(() => {
    filterProspects();
  }, [searchTerm, prospects, selectedTagColor]);

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

  const fetchProspects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5002/api/prospects');
      if (!response.ok) {
        throw new Error('Erro ao buscar prospects');
      }
      const data = await response.json();
      const normalizedProspects = (data.prospects || []).map(prospect => ({
        ...prospect,
        code: prospect.id || prospect.code || '',
        email: prospect.email || '',
        tipo: prospect.tipo || '',
        cpfCnpj: prospect.cpfCnpj || prospect.cpf || '',
        name: prospect.name || prospect.nome || '',
        setor: prospect.setor || prospect.sector || '',
        telefone: formatBrazilianPhone(prospect.telefone || prospect.phone || ''),
        contribuinteICMS: prospect.contribuinteICMS || '',
        inscricaoEstadual: prospect.inscricaoEstadual || '',
        inscricaoMunicipal: prospect.inscricaoMunicipal || '',
        representante: prospect.representante || prospect.representative || '',
        celular: formatBrazilianPhone(prospect.celular || ''),
        cep: prospect.cep || '',
        logradouro: prospect.logradouro || '',
        numero: prospect.numero || '',
        complemento: prospect.complemento || '',
        bairro: prospect.bairro || '',
        cidade: prospect.cidade || '',
        estado: prospect.estado || '',
        followUp: prospect.followUp || prospect.follow_up || '',
        address: [
          prospect.logradouro,
          prospect.numero,
          prospect.complemento,
          prospect.bairro
        ].filter(Boolean).join(', '),
        tags: prospect.tags || [], // Add tags field
      }));
      setProspects(normalizedProspects);
      if (normalizedProspects.length > 0) {
        setSelectedProspect(normalizedProspects[0]);
        setFollowUpText(normalizedProspects[0].followUp || '');
      }
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const filterProspects = () => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = prospects.filter(p => {
      const matchesName = p.name.toLowerCase().includes(lowerTerm) ||
        p.code.toLowerCase().includes(lowerTerm) ||
        p.cpfCnpj.toLowerCase().includes(lowerTerm) ||
        p.representante.toLowerCase().includes(lowerTerm) ||
        p.setor.toLowerCase().includes(lowerTerm);

      const matchesTagColor = selectedTagColor
        ? p.tags.some(tag => tag.color === selectedTagColor)
        : true;

      return matchesName && matchesTagColor;
    });

    setFilteredProspects(filtered);
    if (filtered.length > 0) {
      setSelectedProspect(filtered[0]);
      setFollowUpText(filtered[0].followUp || '');
    } else {
      setSelectedProspect(null);
      setFollowUpText('');
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectProspect = (prospect) => {
    setSelectedProspect(prospect);
    setFollowUpText(prospect.followUp || '');
  };

  const handleDeleteClick = (prospect) => {
    setProspectToDelete(prospect);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/prospects/${prospectToDelete.code}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Erro ao apagar prospect');
      }
      const updatedProspects = prospects.filter(p => p.code !== prospectToDelete.code);
      setProspects(updatedProspects);
      setShowDeleteModal(false);
      setProspectToDelete(null);
      if (selectedProspect && selectedProspect.code === prospectToDelete.code) {
        setSelectedProspect(updatedProspects.length > 0 ? updatedProspects[0] : null);
      }
      alert('Prospect apagado com sucesso!');
    } catch (error) {
      alert('Erro ao apagar prospect. Por favor, tente novamente.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProspectToDelete(null);
  };

  const handleEditClick = (prospect) => {
    navigate(`/admin/prospects/register/${prospect.code}`);
  };

  const handleAddNew = () => {
    navigate('/admin/prospects/register');
  };

  const handleFollowUpClick = () => {
    setShowFollowUpModal(true);
  };

  const closeFollowUpModal = () => {
    setShowFollowUpModal(false);
  };

  const saveFollowUp = async () => {
    if (!selectedProspect) return;
    try {
      // Send only the followUp field in the update request
      const response = await fetch(`http://localhost:5002/api/prospects/${selectedProspect.code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUp: followUpText }),
      });
      if (!response.ok) throw new Error('Erro ao salvar follow up');
      // Update local state with new followUp
      const updatedProspects = prospects.map(p =>
        p.code === selectedProspect.code ? { ...p, followUp: followUpText } : p
      );
      setProspects(updatedProspects);
      setSelectedProspect(prev => ({ ...prev, followUp: followUpText }));
      alert('Follow up salvo com sucesso!');
      closeFollowUpModal();
    } catch (error) {
      alert('Erro ao salvar follow up. Por favor, tente novamente.');
    }
  };

  // Pagination
  const indexOfLast = currentPage * prospectsPerPage;
  const indexOfFirst = indexOfLast - prospectsPerPage;
  const currentProspects = filteredProspects.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProspects.length / prospectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 h-full">
      {/* Prospect List */}
      <div className="md:w-1/3 bg-white rounded-lg shadow p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Prospects</h2>
          <button
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            + Novo
          </button>
        </div>
        {/* Tag color filter buttons */}
        <div className="mb-4 flex space-x-2 items-center">
          {/* "Todas" button with label */}
          <button
            type="button"
            onClick={() => setSelectedTagColor('')}
            className={`px-3 py-1 rounded ${
              selectedTagColor === '' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Todas
          </button>
          {/* Color circle buttons */}
          {[
            { color: '#22c55e' },
            { color: '#eab308' },
            { color: '#ef4444' },
            { color: '#f97316' },
            { color: '#8b5cf6' },
            { color: '#3b82f6' },
          ].map(({ color }) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedTagColor(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedTagColor === color ? 'border-green-600' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Filter by color ${color}`}
              title={`Filter by color ${color}`}
            />
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar prospects..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {loading ? (
          <p>Carregando prospects...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : currentProspects.length === 0 ? (
          <p>Nenhum prospect encontrado.</p>
        ) : (
          <ul ref={listRef} className="overflow-y-auto flex-grow divide-y divide-gray-200">
            {currentProspects.map(prospect => (
              <li
                key={prospect.code}
                onClick={() => handleSelectProspect(prospect)}
                className={`cursor-pointer p-3 hover:bg-green-50 rounded ${
                  selectedProspect && selectedProspect.code === prospect.code ? "bg-green-100" : ""
                }`}
              >
                <div className="font-semibold">{prospect.name}</div>
                <div className="text-sm text-gray-600">{prospect.cpfCnpj}</div>
                <div className="text-sm text-gray-600">{prospect.representante}</div>
                {/* Tags display */}
                <div className="mt-1 flex flex-wrap gap-1">
                {prospect.tags && prospect.tags.length > 0 && prospect.tags.map((tag, index) => {
                  // tag is now an object with name and color
                  const bgColor = tag.color || '#d1d5db'; // default gray if no color
                  const textColor = '#fff';
                  return (
                    <span
                      key={index}
                      className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      {tag.name}
                    </span>
                  );
                })}
                </div>
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

      {/* Prospect Detail Panel */}
      <div className="md:w-2/3 bg-white rounded-lg shadow p-6 flex flex-col">
        {selectedProspect ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Detalhes do Prospect</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium text-gray-700">Código</label>
                <p>{selectedProspect.code}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <p>{selectedProspect.email}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Tipo</label>
                <p>{selectedProspect.tipo}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">CPF/CNPJ</label>
                <p>{selectedProspect.cpfCnpj}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Nome</label>
                <p>{selectedProspect.name}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Representante</label>
                <p>{selectedProspect.representante}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Setor</label>
                <p>{selectedProspect.setor}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Endereço</label>
                <p>{selectedProspect.address}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Cidade</label>
                <p>{selectedProspect.cidade}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Estado</label>
                <p>{selectedProspect.estado}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Telefone</label>
                <p>{selectedProspect.telefone}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Celular</label>
                <p>{selectedProspect.celular}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Tag</label>
                {selectedProspect.tags && selectedProspect.tags.length > 0 ? (() => {
                  const tag = selectedProspect.tags[0];
                  const bgColor = tag.color || '#d1d5db';
                  const textColor = '#fff';
                  return (
                    <span
                      className="inline-block text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      {tag.name}
                    </span>
                  );
                })() : <span>Nenhuma</span>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">Follow Up</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows={6}
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveFollowUp}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Salvar Follow Up
              </button>
              <button
                onClick={() => {
                  if (selectedProspect) {
                    const {
                      cpfCnpj,
                      name,
                      ...rest
                    } = selectedProspect;
                    const clientData = {
                      cpf: cpfCnpj || '',
                      nome: name || '',
                      ...rest
                    };
                    navigate('/admin/clients/register', { state: clientData });
                  }
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Converter para Cliente
              </button>
              <button
                onClick={handleEditClick.bind(null, selectedProspect)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Editar Prospect
              </button>
              <button
                onClick={handleDeleteClick.bind(null, selectedProspect)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Apagar Prospect
              </button>
            </div>
          </>
        ) : (
          <p>Selecione um prospect para ver os detalhes.</p>
        )}

        {/* Follow Up Modal */}
        {showFollowUpModal && selectedProspect && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
              <h3 className="text-xl font-semibold mb-4">Follow Up do Prospect</h3>
              <button
                onClick={closeFollowUpModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                aria-label="Fechar"
              >
                &times;
              </button>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows={8}
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
              />
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={closeFollowUpModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Fechar
                </button>
                <button
                  onClick={saveFollowUp}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && prospectToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
              <h3 className="text-xl font-semibold mb-4">Confirmar exclusão</h3>
              <p>
                Tem certeza que deseja excluir o prospect{" "}
                <strong>{prospectToDelete.name}</strong>?
              </p>
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
    </div>
  );
};

export default ProspectManagement;
