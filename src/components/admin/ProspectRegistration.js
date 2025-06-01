import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validarCPFCNPJ } from '../../services/cnpj';

const formatCPF = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  const part1 = cleaned.slice(0, 3);
  const part2 = cleaned.slice(3, 6);
  const part3 = cleaned.slice(6, 9);
  const part4 = cleaned.slice(9, 11);
  let formatted = part1;
  if (part2) formatted += '.' + part2;
  if (part3) formatted += '.' + part3;
  if (part4) formatted += '-' + part4;
  return formatted;
};

const formatCNPJ = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 14);
  const part1 = cleaned.slice(0, 2);
  const part2 = cleaned.slice(2, 5);
  const part3 = cleaned.slice(5, 8);
  const part4 = cleaned.slice(8, 12);
  const part5 = cleaned.slice(12, 14);
  let formatted = part1;
  if (part2) formatted += '.' + part2;
  if (part3) formatted += '.' + part3;
  if (part4) formatted += '/' + part4;
  if (part5) formatted += '-' + part5;
  return formatted;
};

const ProspectRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    setor: '',
    representante: user?.name || '',
    telefone: '',
    celular: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipo: '',
    contribuinteICMS: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    followUp: '',
    tag: { name: '', color: '#22c55e' }, // Single tag object with default green color
  });
  const [tagConfirmed, setTagConfirmed] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProspect = async () => {
        try {
          const response = await fetch(`http://localhost:5002/api/prospects/${id}`);
          if (!response.ok) throw new Error('Erro ao buscar dados do prospect');
          const result = await response.json();
          const data = result.prospect || {};
      setFormData({
        code: data.code || '',
        email: data.email || '',
        tipo: data.tipo || '',
        cpf: data.cpfCnpj || '',
        nome: data.name || '',
        setor: data.setor || '',
        telefone: data.telefone || '',
        contribuinteICMS: data.contribuinteICMS || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        cep: data.cep || '',
        followUp: data.followUp || '',
        inscricaoEstadual: data.inscricaoEstadual || '',
        inscricaoMunicipal: data.inscricaoMunicipal || '',
        representante: data.representante || user?.name || '',
        celular: data.celular || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        tag: data.tag || { name: '', color: '#22c55e' }, // Set single tag from fetched data or default
      });
        } catch (error) {
          console.error(error);
          setSubmitError('Erro ao carregar dados do prospect para edição.');
        }
      };
      fetchProspect();
    }
  }, [id, user?.name]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let key = name;
    if (name === 'name') key = 'nome';
    else if (name === 'sector') key = 'setor';
    else if (name === 'representative') key = 'representante';
    else if (name === 'phone') key = 'telefone';

    if (key === 'cpf') {
      let formattedValue = value;
      if (formData.tipo === 'Física') {
        formattedValue = formatCPF(value);
      } else if (formData.tipo === 'Jurídica') {
        formattedValue = formatCNPJ(value);
      }
      setFormData(prevState => ({
        ...prevState,
        [key]: formattedValue
      }));
    } else if (key === 'telefone' || key === 'celular') {
      // Format Brazilian phone numbers on input
      const formattedPhone = formatBrazilianPhone(value);
      setFormData(prevState => ({
        ...prevState,
        [key]: formattedPhone
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [key]: value
      }));
    }
  };

  // Handler for setting tag name
  const handleTagNameChange = (e) => {
    const newName = e.target.value;
    // Allow full word input by updating state with the entire input value
    setFormData(prevState => ({
      ...prevState,
      tag: { ...prevState.tag, name: newName }
    }));
  };

  // Handler for setting tag color
  const handleTagColorChange = (e) => {
    const newColor = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      tag: { ...prevState.tag, color: newColor }
    }));
  };

  // Handler for removing tag (clear tag)
  const handleRemoveTag = () => {
    setFormData(prevState => ({
      ...prevState,
      tag: { name: '', color: '#22c55e' }
    }));
  };

  const fetchProspectByCNPJ = async (cnpj) => {
    if (!cnpj || formData.tipo !== 'Jurídica') return;
    const normalizedCnpj = cnpj.replace(/\D/g, '');
    console.log('Fetching prospect by CNPJ:', normalizedCnpj);
    try {
      const response = await fetch(`http://localhost:5002/api/prospects/by-cnpj?cnpj=${encodeURIComponent(normalizedCnpj)}`);
      if (!response.ok) {
        console.log('Prospect not found or error response:', response.status);
        // Prospect not found or other error, do nothing
        return;
      }
      const data = await response.json();
      console.log('Prospect data fetched:', data);
      setFormData(prevState => ({
        ...prevState,
        email: data.email || '',
        tipo: data.tipo || '',
        cpf: data.cpf || '',
        nome: data.nome || '',
        setor: data.setor || '',
        telefone: data.telefone || '',
        contribuinteICMS: data.contribuinteICMS || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        cep: data.cep || '',
        followUp: data.followUp || '',
        inscricaoEstadual: data.inscricaoEstadual || '',
        inscricaoMunicipal: data.inscricaoMunicipal || '',
        representante: data.representante || prevState.representante,
        celular: data.celular || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        tag: data.tag || { name: '', color: '#22c55e' }, // Set single tag from fetched data or default
      }));
    } catch (error) {
      console.error('Error fetching prospect by CNPJ:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate mandatory fields Tipo, Nome and Setor
    if (!formData.tipo) {
      setSubmitError('O campo "Tipo" é obrigatório.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.nome) {
      setSubmitError('O campo "Nome" é obrigatório.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.setor) {
      setSubmitError('O campo "Setor" é obrigatório.');
      setIsSubmitting(false);
      return;
    }

    let tipoForValidation = '';
    if (formData.tipo === 'Física') tipoForValidation = 'Pessoa Física';
    else if (formData.tipo === 'Jurídica') tipoForValidation = 'Pessoa Jurídica';

    if (!validarCPFCNPJ(formData.cpf, tipoForValidation)) {
      setSubmitError(`CPF/CNPJ inválido para o tipo ${formData.tipo}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Check for duplicate CPF/CNPJ
      const responseAll = await fetch('http://localhost:5002/api/prospects');
      if (!responseAll.ok) throw new Error('Erro ao buscar prospects para validação');
      const dataAll = await responseAll.json();
      const normalizeCpfCnpj = (value) => value.replace(/\D/g, '');
      const existingProspect = (dataAll.prospects || []).find(p =>
        p.cpf && normalizeCpfCnpj(p.cpf) === normalizeCpfCnpj(formData.cpf) && p.code !== id
      );
      if (existingProspect) {
        setSubmitError(`Já existe um prospect cadastrado com esse CPF/CNPJ. Código: ${existingProspect.code}`);
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        ...formData,
        representante: user?.name || formData.representante,
      };
      // Convert tag object to tags array for backend with name and color
      submitData.tags = formData.tag.name ? [{ name: formData.tag.name, color: formData.tag.color }] : [];
      delete submitData.tag;
      delete submitData.code;

      let response;
      if (id) {
        response = await fetch(`http://localhost:5002/api/prospects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch('http://localhost:5002/api/prospects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }

      const data = await response.json();

      if (data.success) {
        alert(id ? 'Prospect atualizado com sucesso!' : `Prospect cadastrado com sucesso!\nCódigo: ${data.prospectCode}`);
        navigate('/admin/prospects');
      } else {
        setSubmitError(data.message || (id ? 'Erro ao atualizar prospect' : 'Erro ao cadastrar prospect'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(id ? 'Erro ao atualizar prospect. Por favor, tente novamente.' : 'Erro ao cadastrar prospect. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/prospects');
  };

  const handleClear = () => {
    setFormData({
      code: '',
      cpf: '',
      nome: '',
      setor: '',
      representante: user?.name || '',
      telefone: '',
      celular: '',
      email: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      tipo: '',
      contribuinteICMS: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      followUp: '',
      tag: { name: '', color: '#22c55e' }, // Clear tag on clear
    });
    setSubmitError(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 border-l-4 border-green-600 pl-4">{id ? 'Editar prospect' : 'Cadastrar prospect'}</h2>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* Código field removed as it is auto-generated by backend */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo <span className="text-red-600">*</span>
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Selecione o tipo</option>
                <option value="Física">Física</option>
                <option value="Jurídica">Jurídica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                onBlur={(e) => {
                  console.log('CNPJ input onBlur:', e.target.value);
                  if (formData.tipo === 'Jurídica') {
                    fetchProspectByCNPJ(e.target.value);
                  }
                }}
                placeholder="CPF ou CNPJ"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {submitError && submitError.includes('CPF/CNPJ') && (
                <p className="text-red-600 text-sm mt-1">{submitError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome do prospect"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Setor <span className="text-red-600">*</span>
              </label>
              <select
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Selecione o setor</option>
                <option value="Comercial">Comercial</option>
                <option value="Técnico">Técnico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Representante</label>
              <input
                type="text"
                name="representante"
                value={user?.name || ''}
                placeholder="Representante"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Celular</label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                placeholder="Celular"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="CEP"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                placeholder="Logradouro"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Número"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Complemento"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                placeholder="Estado"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inscrição Estadual</label>
              <input
                type="text"
                name="inscricaoEstadual"
                value={formData.inscricaoEstadual}
                onChange={handleChange}
                placeholder="Inscrição Estadual"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inscrição Municipal</label>
              <input
                type="text"
                name="inscricaoMunicipal"
                value={formData.inscricaoMunicipal}
                onChange={handleChange}
                placeholder="Inscrição Municipal"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contribuinte ICMS</label>
              <input
                type="text"
                name="contribuinteICMS"
                value={formData.contribuinteICMS}
                onChange={handleChange}
                placeholder="Contribuinte ICMS"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow Up</label>
              <textarea
                name="followUp"
                value={formData.followUp}
                onChange={handleChange}
                placeholder="Follow Up"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            {/* Single Tag input with color picker */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              {tagConfirmed && formData.tag.name ? (
                <div
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm cursor-default"
                  style={{ backgroundColor: formData.tag.color, color: '#fff' }}
                >
                  <span>{formData.tag.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveTag();
                      setTagConfirmed(false);
                    }}
                    className="ml-2 text-white hover:text-gray-300 focus:outline-none"
                    aria-label={`Remove tag ${formData.tag.name}`}
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    id="tag-name-input"
                    type="text"
                    value={formData.tag.name}
                    onChange={handleTagNameChange}
                    placeholder="Digite o nome da tag"
                    className="flex-grow rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {/* Replace color picker with fixed color options */}
                  <div className="flex space-x-2">
                    {[
                      { name: 'Verde', color: '#22c55e' },
                      { name: 'Amarelo', color: '#eab308' },
                      { name: 'Vermelho', color: '#ef4444' },
                      { name: 'Laranja', color: '#f97316' },
                      { name: 'Roxo', color: '#8b5cf6' },
                      { name: 'Azul', color: '#3b82f6' },
                    ].map(({ name, color }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          tag: { ...prev.tag, color }
                        }))}
                        className={`w-8 h-8 rounded-full border-2 ${formData.tag.color === color ? 'border-black' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        title={name}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTagConfirmed(true)}
                    disabled={!formData.tag.name.trim()}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Adicionar Tag
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {submitError && !submitError.includes('CPF/CNPJ') && (
          <div className="text-red-600 text-sm">{submitError}</div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? (id ? 'Atualizando...' : 'Cadastrando...') : (id ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProspectRegistration;
