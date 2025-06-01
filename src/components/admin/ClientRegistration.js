import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { consultarCNPJ, validarCPFCNPJ } from '../../services/cnpj';

const ClientRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    tipo: 'Pessoa Física',
    cpf: '',
    nome: '',
    setor: '',
    contribuinteICMS: 'Não',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    representante: user?.name || '',
    telefone: '',
    celular: '',
    email: '',
    followUp: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil'
  });

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const response = await fetch(`http://localhost:5002/api/clients/${id}`);
          if (!response.ok) throw new Error('Erro ao buscar dados do cliente');
          const data = await response.json();
          setFormData({
            tipo: data.tipo || 'Pessoa Física',
            cpf: data.cpf || '',
            nome: data.nome || '',
            setor: data.setor || '',
            contribuinteICMS: data.contribuinteICMS || 'Não',
            inscricaoEstadual: data.inscricaoEstadual || '',
            inscricaoMunicipal: data.inscricaoMunicipal || '',
            representante: data.representante || user?.name || '',
            telefone: data.telefone || '',
            celular: data.celular || '',
            email: data.email || '',
            followUp: data.followUp || '',
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            pais: 'Brasil'
          });
        } catch (error) {
          console.error(error);
          setSubmitError('Erro ao carregar dados do cliente para edição.');
        }
      };
      fetchClient();
    } else if (location.state && Object.keys(location.state).length > 0) {
      // Prefill formData from location state if no id param
      setFormData(prev => ({
        ...prev,
        ...location.state
      }));
    }
  }, [id, user?.name, location.state]);

  const fetchAddressByCep = async (cep) => {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prevState => ({
          ...prevState,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const maskCep = (value) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .replace(/(\d{5})(\d)/, '$1-$2') // Add hyphen after 5 digits
      .substring(0, 9); // Limit to 9 characters (00000-000)
  };

  const maskCpfCnpj = (value, tipo) => {
    value = value.replace(/\D/g, '');
    
    if (tipo === 'Pessoa Física') {
      value = value.substring(0, 11);
      return value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      value = value.substring(0, 14);
      return value
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  const maskPhone = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
      return value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'tipo') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        cpf: ''
      }));
      return;
    }

    switch (name) {
      case 'cep':
        maskedValue = maskCep(value);
        if (maskedValue.replace(/\D/g, '').length === 8) {
          fetchAddressByCep(maskedValue);
        }
        break;
      case 'cpf':
        maskedValue = maskCpfCnpj(value, formData.tipo);
        break;
      case 'telefone':
      case 'celular':
        maskedValue = maskPhone(value);
        break;
      default:
        maskedValue = value;
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: maskedValue
    }));
  };

  const handleCepBlur = (e) => {
    const cep = e.target.value;
    if (cep.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(cep);
    }
  };

  const fetchDataByCpfCnpj = async (value, tipo) => {
    try {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length !== 11 && cleanValue.length !== 14) return;

      setIsLoadingCNPJ(true);
      setSubmitError(null);

      const isValid = validarCPFCNPJ(value, tipo);
      if (!isValid) {
        setSubmitError(`${tipo === 'Pessoa Física' ? 'CPF' : 'CNPJ'} inválido`);
        return;
      }

      if (cleanValue.length === 14 && tipo === 'Pessoa Jurídica') {
        try {
          const data = await consultarCNPJ(cleanValue);
          setFormData(prevState => ({
            ...prevState,
            ...data
          }));
        } catch (error) {
          console.error('Erro ao buscar dados do CNPJ:', error);
          setSubmitError('Erro ao buscar dados do CNPJ. Verifique se o CNPJ é válido.');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do CPF/CNPJ:', error);
      setSubmitError('Erro ao buscar dados do CNPJ');
    } finally {
      setIsLoadingCNPJ(false);
    }
  };

  const handlePhoneBlur = (e) => {
    const { value } = e.target;
    if (value.replace(/\D/g, '').length < 10) {
      setFormData(prevState => ({
        ...prevState,
        [e.target.name]: ''
      }));
    }
  };

  const handleCpfCnpjBlur = (e) => {
    const { value } = e.target;
    fetchDataByCpfCnpj(value, formData.tipo);
  };

  const checkDuplicateCpfCnpj = async (cpfCnpj) => {
    try {
      const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
      if (!cleanCpfCnpj) return null;
      const response = await fetch(`http://localhost:5002/api/clients?cpfCnpj=${cleanCpfCnpj}`);
      if (!response.ok) {
        console.error('Erro ao verificar CPF/CNPJ duplicado');
        return null;
      }
      const data = await response.json();
      if (data.clients && data.clients.length > 0) {
        return data.clients[0]; // Return first matching client
      }
      return null;
    } catch (error) {
      console.error('Erro ao verificar CPF/CNPJ duplicado:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check for duplicate CPF/CNPJ if creating new client
      if (!id && formData.cpf) {
        const duplicateClient = await checkDuplicateCpfCnpj(formData.cpf);
        if (duplicateClient) {
          alert(`Cliente já cadastrado com o CPF/CNPJ informado.\nCódigo do cliente: ${duplicateClient.code || duplicateClient.id}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Ensure representante is set to logged-in user's name before submit
      const submitData = {
        ...formData,
        representante: user?.name || formData.representante,
      };

      let response;
      if (id) {
        response = await fetch(`http://localhost:5002/api/clients/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch('http://localhost:5002/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }

      const data = await response.json();

      if (data.success) {
        alert(id ? 'Cliente atualizado com sucesso!' : `Cliente cadastrado com sucesso!\nCódigo: ${data.clientCode}`);
        navigate('/admin/clients');
      } else {
        setSubmitError(data.message || (id ? 'Erro ao atualizar cliente' : 'Erro ao cadastrar cliente'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(id ? 'Erro ao atualizar cliente. Por favor, tente novamente.' : 'Erro ao cadastrar cliente. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/clients');
  };

  const handleClear = () => {
    setFormData({
      tipo: 'Pessoa Física',
      cpf: '',
      nome: '',
      setor: '',
      contribuinteICMS: 'Não',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      representante: user?.name || '',
      telefone: '',
      celular: '',
      email: '',
      followUp: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil'
    });
    setSubmitError(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 border-l-4 border-blue-600 pl-4">{id ? 'Editar cliente' : 'Cadastrar cliente'}</h2>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
          <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de cliente
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {formData.tipo === 'Pessoa Física' ? 'CPF' : 'CNPJ'}
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  onBlur={handleCpfCnpjBlur}
                  placeholder={formData.tipo === 'Pessoa Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contribuinte ICMS
                </label>
                <select
                  name="contribuinteICMS"
                  value={formData.contribuinteICMS}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Setor <span className="text-red-500">*</span>
                </label>
                <select
                  name="setor"
                  value={formData.setor}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Selecione um setor</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nome/Razão Social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inscrição Municipal
                </label>
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
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                onBlur={handlePhoneBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Celular
              </label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                onBlur={handlePhoneBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
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

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength="9"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
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
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Follow Up */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Up</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="followUp"
              value={formData.followUp}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="text-red-600 text-sm">{submitError}</div>
        )}

        {/* Form actions */}
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
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? (id ? 'Atualizando...' : 'Cadastrando...') : (id ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientRegistration;
