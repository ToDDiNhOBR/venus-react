import React, { useState, useEffect } from 'react';

const AdminProfile = () => {
  const [filiais, setFiliais] = useState([]);
  const [selectedFilial, setSelectedFilial] = useState(null);
  const [formData, setFormData] = useState({
    nomeRazaoSocial: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: '',
    filial: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    loadFiliais();
  }, []);

    const loadFiliais = async () => {
      try {
        setError(null);
        setListLoading(true);
        const response = await fetch('http://localhost:5002/api/admin/filiais');
        if (!response.ok) {
          throw new Error('Falha ao carregar filiais');
        }
        const data = await response.json();
        setFiliais(data.filiais);
        if (data.filiais.length > 0) {
          setSelectedFilial(data.filiais[0]);
          // Fix mapping of fields from API to formData
          const f = data.filiais[0];
          setFormData({
            nomeRazaoSocial: f.nome || '',
            cnpj: f.cnpj || '',
            inscricaoEstadual: f.inscricaoEstadual || '',
            inscricaoMunicipal: f.inscricaoMunicipal || '',
            cep: f.cep || '',
            logradouro: f.logradouro || '',
            numero: f.numero || '',
            complemento: f.complemento || '',
            bairro: f.bairro || '',
            cidade: f.cidade || '',
            uf: f.uf || '',
            telefone: f.telefone || '',
            email: f.email || '',
            filial: f.filial || '',
          });
        } else {
          setSelectedFilial(null);
          setFormData({
            nomeRazaoSocial: '',
            cnpj: '',
            inscricaoEstadual: '',
            inscricaoMunicipal: '',
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
            telefone: '',
            email: '',
            filial: '',
          });
        }
        setListLoading(false);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar filiais:', err);
        setError('Erro ao carregar filiais: ' + err.message);
        setLoading(false);
        setListLoading(false);
      }
    };

  const handleSelectFilial = (filial) => {
    setSelectedFilial(filial);
    setFormData({
      nomeRazaoSocial: filial.nome || '',
      cnpj: filial.cnpj || '',
      inscricaoEstadual: filial.inscricaoEstadual || '',
      inscricaoMunicipal: filial.inscricaoMunicipal || '',
      cep: filial.cep || '',
      logradouro: filial.logradouro || '',
      numero: filial.numero || '',
      complemento: filial.complemento || '',
      bairro: filial.bairro || '',
      cidade: filial.cidade || '',
      uf: filial.uf || '',
      telefone: filial.telefone || '',
      email: filial.email || '',
      filial: filial.filial || '',
    });
    setSaveStatus('');
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      let response;
      if (selectedFilial && selectedFilial.id) {
        // Update existing filial
        const mappedData = {
          nome: formData.nomeRazaoSocial,
          cnpj: formData.cnpj,
          inscricaoEstadual: formData.inscricaoEstadual,
          inscricaoMunicipal: formData.inscricaoMunicipal,
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          telefone: formData.telefone,
          email: formData.email,
          filial: formData.filial,
        };
        response = await fetch(`http://localhost:5002/api/admin/filiais/${selectedFilial.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedData),
        });
      } else {
        // Add new filial
        const mappedData = {
          nome: formData.nomeRazaoSocial,
          cnpj: formData.cnpj,
          inscricaoEstadual: formData.inscricaoEstadual,
          inscricaoMunicipal: formData.inscricaoMunicipal,
          cep: formData.cep,
          logradouro: formData.logradouro,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          telefone: formData.telefone,
          email: formData.email,
          filial: formData.filial,
        };
        response = await fetch('http://localhost:5002/api/admin/filiais', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedData),
        });
      }

      if (!response.ok) {
        throw new Error('Falha ao salvar filial');
      }

      setSaveStatus('success');
      await loadFiliais();
      // After loading filiais, set selectedFilial to the newly added or updated filial
      const data = await fetch('http://localhost:5002/api/admin/filiais').then(res => res.json());
      if (data.filiais && data.filiais.length > 0) {
        if (selectedFilial && selectedFilial.id) {
          // For update, find the updated filial by id
          const updatedFilial = data.filiais.find(f => f.id === selectedFilial.id);
          if (updatedFilial) {
            // Map the updated filial fields to formData keys explicitly
            setSelectedFilial(updatedFilial);
            setFormData({
              nomeRazaoSocial: updatedFilial.nome || '',
              cnpj: updatedFilial.cnpj || '',
              inscricaoEstadual: updatedFilial.inscricaoEstadual || '',
              inscricaoMunicipal: updatedFilial.inscricaoMunicipal || '',
              cep: updatedFilial.cep || '',
              logradouro: updatedFilial.logradouro || '',
              numero: updatedFilial.numero || '',
              complemento: updatedFilial.complemento || '',
              bairro: updatedFilial.bairro || '',
              cidade: updatedFilial.cidade || '',
              uf: updatedFilial.uf || '',
              telefone: updatedFilial.telefone || '',
              email: updatedFilial.email || '',
              filial: updatedFilial.filial || '',
            });
          }
        } else {
          // For new filial, select the last one (newly added)
          const newFilial = data.filiais[data.filiais.length - 1];
          // Map the new filial fields to formData keys explicitly
          setSelectedFilial(newFilial);
          setFormData({
            nomeRazaoSocial: newFilial.nome || '',
            cnpj: newFilial.cnpj || '',
            inscricaoEstadual: newFilial.inscricaoEstadual || '',
            inscricaoMunicipal: newFilial.inscricaoMunicipal || '',
            cep: newFilial.cep || '',
            logradouro: newFilial.logradouro || '',
            numero: newFilial.numero || '',
            complemento: newFilial.complemento || '',
            bairro: newFilial.bairro || '',
            cidade: newFilial.cidade || '',
            uf: newFilial.uf || '',
            telefone: newFilial.telefone || '',
            email: newFilial.email || '',
            filial: newFilial.filial || '',
          });
        }
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar filial: ' + err.message);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleAddNew = () => {
    setSelectedFilial(null);
    setFormData({
      nomeRazaoSocial: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      telefone: '',
      email: '',
      filial: '',
    });
    setSaveStatus('');
    setError(null);
  };

  const handleDelete = async () => {
    if (!selectedFilial || !selectedFilial.id) {
      setError('Selecione uma filial para excluir');
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir esta filial?')) {
      return;
    }
    try {
      setSaveStatus('saving');
      const response = await fetch(`http://localhost:5002/api/admin/filiais/${selectedFilial.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao excluir filial');
      }
      setSaveStatus('success');
      await loadFiliais();
      setSelectedFilial(null);
      setFormData({
        nomeRazaoSocial: '',
        cnpj: '',
        inscricaoEstadual: '',
        inscricaoMunicipal: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        telefone: '',
        email: '',
        filial: '',
      });
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setError('Erro ao excluir filial: ' + err.message);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-3">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Carregando filiais...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
            </div>
            <div>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Filiais</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {listLoading ? (
          <div className="text-gray-600">Carregando lista de filiais...</div>
        ) : (
          filiais.map(filial => (
            <button
              key={filial.id}
              onClick={() => handleSelectFilial(filial)}
              className={`px-4 py-2 rounded border ${
                selectedFilial && selectedFilial.id === filial.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
              }`}
            >
            {filial.filial || filial.nome || filial.nomeRazaoSocial || `Filial ${filial.id}`}
            </button>
          ))
        )}
        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded border bg-green-600 text-white hover:bg-green-700"
        >
          + Nova Filial
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {/* Company Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
              <input
                type="text"
                name="nomeRazaoSocial"
                value={formData.nomeRazaoSocial}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inscrição Estadual</label>
              <input
                type="text"
                name="inscricaoEstadual"
                value={formData.inscricaoEstadual}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inscrição Municipal</label>
              <input
                type="text"
                name="inscricaoMunicipal"
                value={formData.inscricaoMunicipal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rua</label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                maxLength="2"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Filial */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filial</h3>
          <div>
            <input
              type="text"
              name="filial"
              value={formData.filial}
              onChange={handleChange}
              placeholder="Informe a filial"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end items-center space-x-2">
          {saveStatus === 'saving' && (
            <span className="text-gray-600">Salvando...</span>
          )}
          {saveStatus === 'success' && (
            <span className="text-green-600">Operação realizada com sucesso!</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600">Erro na operação</span>
          )}
          <button 
            type="submit"
            disabled={saveStatus === 'saving'}
            className={`px-6 py-2 rounded-md text-white ${
              saveStatus === 'saving'
                ? 'bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={handleAddNew}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Nova Filial
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saveStatus === 'saving' || !selectedFilial}
            className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Excluir Filial
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
