import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import HomeView from './HomeView';
import AdminProfile from './AdminProfile';
import Reports from './Reports';
import Employees from './Employees';
import Products from './Products';
import Users from './Users';
import Quotations from './Quotations';
import Clients from './Clients';

const MainDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/admin" className="text-white font-bold text-xl hover:text-blue-400 transition-colors">
                  Venus Admin
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/admin/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/profile')}`}
                  >
                    Dados do Administrador
                  </Link>
                  <Link
                    to="/admin/reports"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/reports')}`}
                  >
                    Relatórios
                  </Link>
                  <Link
                    to="/admin/employees"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/employees')}`}
                  >
                    Colaboradores
                  </Link>
                  <Link
                    to="/admin/products"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/products')}`}
                  >
                    Produtos
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/users')}`}
                  >
                    Usuários
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route index element={<HomeView />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="reports" element={<Reports />} />
          <Route path="employees" element={<Employees />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="clients" element={<Clients />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainDashboard;
