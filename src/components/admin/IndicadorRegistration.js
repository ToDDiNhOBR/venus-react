import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validarCPFCNPJ, consultarCNPJ } from '../../services/cnpj';

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

const IndicadorRegistration = () => {
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
  });

  useEffect(() => {
    if (id) {
      const fetchIndicador = async () => {
        try {
          const response = await fetch(`http://localhost:5002/api/indicador/${id}`);
          if (!response.ok) throw new Error('Erro ao buscar dados do indicador');
          const data = await response.json();
          setFormData({
            code: data.indicador?.code || '',
            email: data.indicador?.email || '',
            tipo: data.indicador?.tipo || '',
            cpf: data.indicador?.cpfCnpj || '',
            nome: data.indicador?.name || '',
            setor: data.indicador?.setor || '',
            telefone: data.indicador?.telefone || '',
            contribuinteICMS: data.indicador?.contribuinteICMS || '',
            cidade: data.indicador?.cidade || '',
            estado: data.indicador?.estado || '',
            cep: data.indicador?.cep || '',
            followUp: data.indicador?.followUp || '',
            inscricaoEstadual: data.indicador?.inscricaoEstadual || '',
            inscricaoMunicipal: data.indicador?.inscricaoMunicipal || '',
            representante: data.indicador?.representante || user?.name || '',
            celular: data.indicador?.celular || '',
            logradouro: data.indicador?.logradouro || '',
            numero: data.indicador?.numero || '',
            complemento: data.indicador?.complemento || '',
            bairro: data.indicador?.bairro || '',
          });
        } catch (error) {
          console.error(error);
          setSubmitError('Erro ao carregar dados do indicador para edição.');
        }
      };
      fetchIndicador();
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
      // Format phone numbers on input
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

  const handleCNPJBlur = async () => {
    if (formData.tipo === 'Jurídica') {
      const cleanCNPJ = formData.cpf.replace(/\D/g, '');
      if (cleanCNPJ.length === 14) {
        try {
          const cnpjData = await consultarCNPJ(cleanCNPJ);
          setFormData(prevState => ({
            ...prevState,
            nome: cnpjData.nome || prevState.nome,
            logradouro: cnpjData.logradouro || prevState.logradouro,
            numero: cnpjData.numero || prevState.numero,
            complemento: cnpjData.complemento || prevState.complemento,
            bairro: cnpjData.bairro || prevState.bairro,
            cidade: cnpjData.cidade || prevState.cidade,
            estado: cnpjData.estado || prevState.estado,
            cep: cnpjData.cep || prevState.cep,
            telefone: cnpjData.telefone || prevState.telefone,
            email: cnpjData.email || prevState.email,
          }));
        } catch (error) {
          alert(error.message || 'Erro ao buscar dados do CNPJ.');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    let tipoForValidation = '';
    if (formData.tipo === 'Física') tipoForValidation = 'Pessoa Física';
    else if (formData.tipo === 'Jurídica') tipoForValidation = 'Pessoa Jurídica';

    if (!validarCPFCNPJ(formData.cpf, tipoForValidation)) {
      setSubmitError(`CPF/CNPJ inválido para o tipo ${formData.tipo}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        representante: user?.name || formData.representante,
      };
      delete submitData.code;

      let response;
      if (id) {
        response = await fetch(`http://localhost:5002/api/indicador/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        response = await fetch('http://localhost:5002/api/indicador', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }

      const data = await response.json();

      if (data.success) {
        alert(id ? 'Indicador atualizado com sucesso!' : `Indicador cadastrado com sucesso!\nCódigo: ${data.indicadorCode}`);
        navigate('/admin/indicador');
      } else {
        setSubmitError(data.message || (id ? 'Erro ao atualizar indicador' : 'Erro ao cadastrar indicador'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(id ? 'Erro ao atualizar indicador. Por favor, tente novamente.' : 'Erro ao cadastrar indicador. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/indicador');
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
    });
    setSubmitError(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 border-l-4 border-purple-600 pl-4">{id ? 'Editar indicador' : 'Cadastrar indicador'}</h2>
      
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                onBlur={handleCNPJBlur}
                placeholder="CPF ou CNPJ"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                placeholder="Nome do indicador"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="">Selecione o setor</option>
                <option value="Comercial">Comercial</option>
                <option value="Técnico">Técnico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Representante
              </label>
              <select
                name="representante"
                value={formData.representante}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Selecione um representante</option>
                <option value="Representante 1">Representante 1</option>
                <option value="Representante 2">Representante 2</option>
                <option value="Representante 3">Representante 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
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
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isSubmitting ? (id ? 'Atualizando...' : 'Cadastrando...') : (id ? 'Atualizar' : 'Cadastrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndicadorRegistration;
