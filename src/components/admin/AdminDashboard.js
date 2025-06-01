import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import AdminLayout from './AdminLayout';
import HomeView from './HomeView';
import AdminProfile from './AdminProfile';
import Reports from './Reports';
import Employees from './Employees';
import Products from './Products';
import Users from './Users';
import Quotations from './Quotations';
import ClientManagement from './ClientManagement';
import ClientRegistration from './ClientRegistration';
import SheetsTest from './SheetsTest';
import ProspectManagement from './ProspectManagement';
import ProspectRegistration from './ProspectRegistration';
import IndicadorManagement from './IndicadorManagement';
import IndicadorRegistration from './IndicadorRegistration';
import UsuarioRegistration from './UsuarioRegistration';
import UserProfile from './UserProfile';
import AdminNotifications from './AdminNotifications';

// Placeholder component for Financial section
const Financial = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Financeiro</h2>
    <div className="bg-white shadow rounded-lg p-6">
      <p>Seção Financeira em desenvolvimento</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { logout } = useAuth();

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<HomeView />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="sheets-test" element={<SheetsTest />} />
        <Route path="reports" element={<Reports />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/register" element={<UsuarioRegistration />} />
        <Route path="employees/register/:id" element={<UsuarioRegistration />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="clients" element={<ClientManagement />} />
        <Route path="clients/register" element={<ClientRegistration />} />
        <Route path="clients/register/:id" element={<ClientRegistration />} />
        <Route path="prospects" element={<ProspectManagement />} />
        <Route path="prospects/register" element={<ProspectRegistration />} />
        <Route path="prospects/register/:id" element={<ProspectRegistration />} />
        <Route path="indicador" element={<IndicadorManagement />} />
        <Route path="indicador/register" element={<IndicadorRegistration />} />
        <Route path="indicador/register/:id" element={<IndicadorRegistration />} />
        <Route path="financial" element={<Financial />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
