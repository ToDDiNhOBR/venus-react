import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/usuarios');
        if (response.data && response.data.usuarios) {
          setEmployees(response.data.usuarios);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setEmployeeToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5002/api/usuarios/${employeeToDelete.id}`);
      if (response.status === 200) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete.id));
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
        alert('Colaborador excluído com sucesso.');
      } else {
        alert('Erro ao excluir colaborador. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao excluir colaborador:', error);
      alert('Erro ao excluir colaborador. Tente novamente.');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Cadastro de Colaboradores</h2>
        <button
          onClick={() => navigate('/admin/employees/register')}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
        >
          Novo Colaborador
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.cargo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.celular}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.filial}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/admin/employees/register/${employee.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(employee)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4 mt-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{employee.nome}</h3>
              <div>
                <button
                  onClick={() => navigate(`/admin/employees/register/${employee.id}`)}
                  className="text-blue-600 hover:text-blue-900 mr-3 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => openDeleteModal(employee)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
            <p><span className="font-semibold">Cargo:</span> {employee.cargo}</p>
            <p><span className="font-semibold">Email:</span> {employee.email}</p>
            <p><span className="font-semibold">Celular:</span> {employee.celular}</p>
            <p><span className="font-semibold">Filial:</span> {employee.filial}</p>
          </div>
        ))}
      </div>

      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir o colaborador <strong>{employeeToDelete.nome}</strong>?</p>
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
  );
};

export default Employees;
