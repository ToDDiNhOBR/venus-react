import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  // Helper to build full photo URL
  const getPhotoUrl = (foto) => {
    if (!foto) return '';
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      return foto;
    }
    return `http://localhost:5002/user-perfil-images/${foto}`;
  };

  // Local state for editable fields
  const [photo, setPhoto] = useState(getPhotoUrl(user?.imagem || ''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Additional user info fields (assuming these are part of user object or fetched)
  const [userInfo, setUserInfo] = useState({
    nome: user?.nome || '',
    nomeUsuario: user?.nomeUsuario || '',
    email: user?.email || '',
    celular: user?.celular || '',
    dataAdmissao: user?.dataAdmissao || '',
  });

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For preview, create a local URL
      const photoURL = URL.createObjectURL(file);
      setPhoto(photoURL);
      // In real app, upload file to server here
      // For now, just update local state
    }
  };

  // Update photo state if user.foto changes
  React.useEffect(() => {
    setPhoto(getPhotoUrl(user?.imagem || ''));
  }, [user?.imagem]);

  // Handle password input changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle password update submission
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    if (password !== confirmPassword) {
      setStatusMessage('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setStatusMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!user || !user.id) {
      setStatusMessage('Usuário não autenticado.');
      return;
    }
    setLoading(true);
    try {
      // Call backend API to update password via PUT /api/usuarios/:id
      const response = await fetch(`http://localhost:5002/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senha: password }),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar a senha.');
      }
      setStatusMessage('Senha atualizada com sucesso.');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (error) {
      setStatusMessage(error.message || 'Erro ao atualizar a senha.');
      setLoading(false);
    }
  };

  // Handle photo upload submission (if needed)
  const handlePhotoUpload = async () => {
    setStatusMessage('');
    setLoading(true);
    try {
      if (!user || !user.id) {
        setStatusMessage('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      const fileInput = document.querySelector('input[type="file"]');
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        setStatusMessage('Nenhuma foto selecionada.');
        setLoading(false);
        return;
      }
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user.id);
      formData.append('oldImage', user.imagem || '');

      // Upload image file to backend
      const uploadResponse = await fetch('http://localhost:5002/api/user-image/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error('Erro ao enviar a foto para o servidor.');
      }
      const uploadResult = await uploadResponse.json();
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Erro desconhecido no upload da foto.');
      }

      // Update user imagem field in Google Sheets via PUT /api/usuarios/:id
      const updateResponse = await fetch(`http://localhost:5002/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagem: uploadResult.filename }),
      });
      if (!updateResponse.ok) {
        throw new Error('Erro ao atualizar a foto no perfil.');
      }

      // Update local photo state and user context (if context update function available)
      setPhoto(getPhotoUrl(uploadResult.filename));
      setStatusMessage('Foto atualizada com sucesso.');
      setLoading(false);
    } catch (error) {
      setStatusMessage(error.message || 'Erro ao atualizar a foto.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Meu Perfil</h2>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-6">
        <div className="mb-4 md:mb-0">
          <label className="block font-medium mb-1">Foto de Perfil</label>
          <div className="mb-2">
            {photo ? (
              <img src={photo} alt="Foto de Perfil" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                Sem foto
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          <button
            onClick={handlePhotoUpload}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Atualizar Foto
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Nome</label>
            <p className="mt-1">{userInfo.nome}</p>
          </div>

          <div>
            <label className="block font-medium">Nome de Usuário</label>
            <p className="mt-1">{userInfo.nomeUsuario}</p>
          </div>

          <div>
            <label className="block font-medium">E-mail</label>
            <p className="mt-1">{userInfo.email}</p>
          </div>

          <div>
            <label className="block font-medium">Celular</label>
            <p className="mt-1">{userInfo.celular}</p>
          </div>

          <div>
            <label className="block font-medium">Data de Admissão</label>
            <p className="mt-1">{userInfo.dataAdmissao}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handlePasswordUpdate} className="max-w-md">
        <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
        <div className="mb-4">
          <label className="block font-medium">Nova Senha</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 w-full border rounded px-3 py-2"
            required
            minLength={6}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Confirmar Nova Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mt-1 w-full border rounded px-3 py-2"
            required
            minLength={6}
          />
        </div>
        {statusMessage && (
          <p className="mb-4 text-sm text-red-600">{statusMessage}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Atualizar Senha
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
