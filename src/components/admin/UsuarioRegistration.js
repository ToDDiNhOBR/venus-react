import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UsuarioRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: '',
    nomeUsuario: '',
    email: '',
    filial: '',  // added filial field
    cpf: '',
    celular: '',
    cargo: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    dataAdmissao: '',
    statusUsuario: '',
    permissoes: '', // will store comma separated string
    senha: '',
    salarioFixo: '',
    comissao1: '',
    comissao2: '',
    comissao3: '',
    comissao4: '',
    bonus: '',
    observacoes: '',
    imagem: '', // new field for image base64
  });

  // New state to handle permissoes as array for checkboxes
  const [permissoesArray, setPermissoesArray] = useState([]);

  // Permission options
  const permissionOptions = [
    "Admin Master",
    "Admin",
    "Vendedor",
    "Financeiro",
    "Ver todos os Clientes",
    "Ver todos os Indicadores",
    "Ver todos os Prospects",
    "Ver todos os Orçamentos",
    "Relatório de Finanças"
  ];

  // Sync permissoes string to permissoesArray on formData change (for edit)
  useEffect(() => {
    if (formData.permissoes) {
      const perms = formData.permissoes.split(',').map(p => p.trim());
      setPermissoesArray(perms);
    } else {
      setPermissoesArray([]);
    }
  }, [formData.permissoes]);

  // Handle checkbox change
  const handlePermissaoChange = (e) => {
    const { value, checked } = e.target;
    let updatedPerms = [...permissoesArray];
    if (checked) {
      if (!updatedPerms.includes(value)) {
        updatedPerms.push(value);
      }
    } else {
      updatedPerms = updatedPerms.filter(p => p !== value);
    }
    setPermissoesArray(updatedPerms);
    setFormData(prevState => ({
      ...prevState,
      permissoes: updatedPerms.join(', ')
    }));
  };

  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        try {
          const response = await fetch(`http://localhost:5002/api/usuarios/${id}`);
          if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
          const data = await response.json();
          setFormData({
            nome: data.nome || '',
            nomeUsuario: data.nomeUsuario || '',
            email: data.email || '',
            filial: data.filial || '',  // added filial
            cpf: data.cpf || '',
            celular: data.celular || '',
            cargo: data.cargo || '',
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            dataAdmissao: data.dataAdmissao || '',
            statusUsuario: data.statusUsuario || '',
            permissoes: data.permissoes || '',
            senha: data.senha || '',
            salarioFixo: data.salarioFixo || '',
            comissao1: data.comissao1 || '',
            comissao2: data.comissao2 || '',
            comissao3: data.comissao3 || '',
            comissao4: data.comissao4 || '',
            bonus: data.bonus || '',
            observacoes: data.observacoes || '',
            imagem: data.imagem ? `http://localhost:5002/user-perfil-images/${data.imagem}` : '',
          });
        } catch (error) {
          console.error(error);
          setSubmitError('Erro ao carregar dados do usuário para edição.');
        }
      };
      fetchUsuario();
    }
  }, [id]);

  const maskCep = (value) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .replace(/(\d{5})(\d)/, '$1-$2') // Add hyphen after 5 digits
      .substring(0, 9); // Limit to 9 characters (00000-000)
  };

  const maskCpf = (value) => {
    value = value.replace(/\D/g, '');
    value = value.substring(0, 11);
    return value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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

    switch (name) {
      case 'cep':
        maskedValue = maskCep(value);
        break;
      case 'cpf':
        maskedValue = maskCpf(value);
        break;
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

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          imagem: reader.result, // base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let response;
      if (id) {
        response = await fetch(`http://localhost:5002/api/usuarios/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('http://localhost:5002/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (data.success) {
        alert(id ? 'Usuário atualizado com sucesso!' : `Usuário cadastrado com sucesso!\nCódigo: ${data.usuarioCode || data.usuarioCode}`);
        navigate('/admin/employees'); // Redirect to employees page after save/edit
      } else {
        setSubmitError(data.message || (id ? 'Erro ao atualizar usuário' : 'Erro ao cadastrar usuário'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(id ? 'Erro ao atualizar usuário. Por favor, tente novamente.' : 'Erro ao cadastrar usuário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/employees'); // Redirect to employees page on cancel
  };

  const handleClear = () => {
    setFormData({
      nome: '',
      nomeUsuario: '',
      email: '',
      filial: '',
      cpf: '',
      celular: '',
      cargo: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      dataAdmissao: '',
      statusUsuario: '',
      permissoes: '',
      senha: '',
      salarioFixo: '',
      comissao1: '',
      comissao2: '',
      comissao3: '',
      comissao4: '',
      bonus: '',
      observacoes: '',
    });
    setSubmitError(null);
  };

  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-semibold mb-6 border-l-4 border-blue-600 pl-4">Cadastro de Colaborador</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
            <input
              type="text"
              name="nomeUsuario"
              value={formData.nomeUsuario}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filial</label>
            <input
              type="text"
              name="filial"
              value={formData.filial}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Celular</label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Logradouro</label>
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
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dados de Trabalho */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dados de Trabalho</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cargo</label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Admissão</label>
              <input
                type="date"
                name="dataAdmissao"
                value={formData.dataAdmissao}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">Status do Usuário</label>
            <select
              name="statusUsuario"
              value={formData.statusUsuario}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            </div>
          </div>
        </div>

        {/* Permissões e Senha */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Permissões e Senha</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Permissões</label>
              <div className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2">
                {permissionOptions.map((perm) => (
                  <div key={perm} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`perm-${perm}`}
                      name="permissoes"
                      value={perm}
                      checked={permissoesArray.includes(perm)}
                      onChange={handlePermissaoChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`perm-${perm}`} className="ml-2 block text-sm text-gray-700">
                      {perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Salário e Comissões */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Salário e Comissões</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Salário Fixo (R$)</label>
              <input
                type="number"
                name="salarioFixo"
                value={formData.salarioFixo}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comissão 1 (%)</label>
              <input
                type="number"
                name="comissao1"
                value={formData.comissao1}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comissão 2 (%)</label>
              <input
                type="number"
                name="comissao2"
                value={formData.comissao2}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comissão 3 (%)</label>
              <input
                type="number"
                name="comissao3"
                value={formData.comissao3}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comissão 4 (%)</label>
              <input
                type="number"
                name="comissao4"
                value={formData.comissao4}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

          {/* Error message */}
          {submitError && (
            <div className="text-red-600 text-sm">{submitError}</div>
          )}

          {/* Image upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Colaborador</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.imagem && (
              <img
                src={formData.imagem}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded-full border border-gray-300"
              />
            )}
          </div>

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

export default UsuarioRegistration;
