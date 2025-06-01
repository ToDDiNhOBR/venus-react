import React, { useState, useEffect } from 'react';
import { getAdminData } from '../../config/sheets';

const ProfileTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getAdminData();
        setData(profileData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!data) return <div>Nenhum dado encontrado</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teste de Integração com Google Sheets</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ProfileTest;
