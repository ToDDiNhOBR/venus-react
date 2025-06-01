import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5002',
});

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('Todos');
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
    fetchCollaborators();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data);
    } catch (err) {
      setError('Erro ao carregar notificações.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await api.get('/api/usuarios');
      console.log('Fetched collaborators:', response.data);
      setCollaborators(response.data.usuarios || []);
    } catch (err) {
      console.error('Erro ao carregar colaboradores.', err);
    }
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Título e mensagem são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Send recipient info along with title and message
      await api.post('/api/notifications', { title, message, recipient });
      setSuccess('Notificação adicionada com sucesso.');
      setTitle('');
      setMessage('');
      setRecipient('Todos');
      fetchNotifications();
    } catch (err) {
      setError('Erro ao adicionar notificação.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/notifications/${id}`);
      setSuccess('Notificação deletada com sucesso.');
      fetchNotifications();
    } catch (err) {
      setError('Erro ao deletar notificação.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (notif) => {
    setEditingId(notif.id);
    setEditTitle(notif.title);
    setEditMessage(notif.message);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditMessage('');
    setError('');
    setSuccess('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editMessage.trim()) {
      setError('Título e mensagem são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/api/notifications/${id}`, { title: editTitle, message: editMessage });
      setSuccess('Notificação atualizada com sucesso.');
      setEditingId(null);
      setEditTitle('');
      setEditMessage('');
      fetchNotifications();
    } catch (err) {
      setError('Erro ao atualizar notificação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Notificações</h2>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <form onSubmit={handleAddNotification}>
          <div className="mb-4">
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Destinatário
            </label>
            <select
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={loading}
            >
              <option value="Todos">Todos</option>
              {collaborators.map((collab) => (
                <option key={collab.id} value={collab.id}>
                  {collab.nomeUsuario || collab.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Mensagem
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={4}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            Adicionar Notificação
          </button>
        </form>
        {error && <p className="mt-2 text-red-600">{error}</p>}
        {success && <p className="mt-2 text-green-600">{success}</p>}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Lista de Notificações</h3>
        {loading && <p>Carregando...</p>}
        {!loading && notifications.length === 0 && <p>Nenhuma notificação encontrada.</p>}
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif.id} className="border border-gray-300 rounded p-3 bg-gray-50">
              {editingId === notif.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mb-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    disabled={loading}
                  />
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="mb-2 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={3}
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleSaveEdit(notif.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h4 className="font-semibold">{notif.title}</h4>
                  <p>{notif.message}</p>
                  <p className="text-sm text-gray-500 mt-1">Enviado para: {notif.sender || 'Desconhecido'}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(notif)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      disabled={loading}
                    >
                      Deletar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminNotifications;
