import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    fetchUserNotifications();
  }, [userId]);

  const fetchUserNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch notifications from the new backend endpoint
      const response = await axios.get(`/api/notifications/user/${userId}`);
      setNotifications(response.data);
    } catch (err) {
      setError('Erro ao carregar notificações do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      // Update notifications state to mark the notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      setError('Erro ao marcar notificação como lida.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Minhas Notificações</h3>
      {loading && <p>Carregando notificações...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && notifications.length === 0 && <p>Você não tem notificações.</p>}
      <ul className="space-y-3">
        {notifications.map((notif, index) => (
          <li
            key={index}
            className={`border border-gray-300 rounded p-3 ${
              notif.read ? 'bg-gray-200 opacity-50' : 'bg-white'
            }`}
          >
            <h4 className="font-semibold">{notif.title}</h4>
            <p>{notif.message}</p>
            <small className="text-gray-500">{new Date(notif.date).toLocaleString()}</small>
            {!notif.read && (
              <button
                onClick={() => markAsRead(notif.id)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Marcar como lida
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotifications;
