import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [clientesOpen, setClientesOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  const { user, logout } = useAuth();

  // Replace the "Meu perfil" link to point to the new UserProfile component route

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Overlay */}
      {/* Overlay - only on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-25"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 bg-gray-900 text-white flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out
        w-64 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile menu close button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Logo */}
        <div className="p-3 border-b border-gray-800">
          <Link to="/admin" className="flex justify-center">
            <img
              src="https://img1.wsimg.com/isteam/ip/3c0378ac-c8f5-41de-bd1a-328f8aa0bea1/TERMOFLEX%20REPRESENTA%C3%87%C3%95ES%20(2).png/:/rs=h:80,cg:true,m/qt=q:95"
              alt="Venus Logo"
              className="h-16"
            />
          </Link>
        </div>
            {/* Menu Items */}
            <nav className="flex-1 py-4">
              <ul className="space-y-2">
                {/* Dashboard */}
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      location.pathname === '/admin'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                {/* Orçamentos e Pedidos */}
                <li>
                  <Link
                    to="/admin/quotations"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/quotations')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    Orçamentos e Pedidos
                  </Link>
                </li>
                {/* Clientes Section */}
                <li>
                  <button
                    onClick={() => setClientesOpen(!clientesOpen)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm ${
                      isActive('/clients') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Clientes
                    </div>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${clientesOpen ? 'rotate-180' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {/* Clientes Submenu */}
                  <div className={`pl-4 mt-2 space-y-2 ${clientesOpen ? 'block' : 'hidden'}`}>
                    <Link
                      to="/admin/prospects"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/prospects')
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Prospect
                    </Link>
                    <Link
                      to="/admin/clients"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/clients')
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Cliente
                    </Link>
                    <Link
                      to="/admin/indicador"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/indicador')
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Indicador
                    </Link>
                  </div>
                </li>
                {/* Additional Menu Items */}
                <li className="mt-4">
                  <Link
                    to="/admin/profile"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/profile')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Dados do Administrador
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/notifications"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/notifications')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notificações
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/reports"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/reports')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                    </svg>
                    Relatórios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/employees"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/employees')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Cadastro de Colaboradores
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/products"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/products')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    Cadastro de Produtos
                  </Link>
                </li>
              </ul>
            </nav>
      </div>
      {/* Main Content */}
      {/* Menu toggle button */}      
      <div className={`fixed top-6 ${sidebarOpen ? 'left-[268px]' : 'left-6'} z-40 transition-all duration-300`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-gray-900 text-white focus:outline-none hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      <div className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-0">
          {/* Header spacing */}
          <div className={`${location.pathname === '/admin' ? 'h-0' : 'h-16'} md:${location.pathname === '/admin' ? 'h-0' : 'h-16'}`} />
          {children}
        </div>
        {/* User Profile Section */}
        <div className={`fixed bottom-0 right-0 flex items-center justify-end w-full ${sidebarOpen ? 'md:w-[calc(100%-16rem)]' : 'md:w-full'} bg-white/10 backdrop-blur-sm px-4 md:px-8 py-[0.2rem] border-t border-gray-200/20 shadow-sm z-10 transition-all duration-300`}>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-4 focus:outline-none"
            >
              <div className="text-right mr-3 md:mr-6">
                <p className="text-sm text-gray-500">Olá,</p>
                <p className="font-medium hidden md:block">{user ? user.nomeUsuario : 'Usuário'}</p>
                <p className="font-medium md:hidden">{user ? user.nomeUsuario : 'Usuário'}</p>
                <p className="text-xs text-gray-500 hidden md:block">{user ? user.email : ''}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-300/50 flex items-center justify-center overflow-hidden">
                {user && user.imagem ? (
                  <img
                    src={user.imagem.startsWith('http') ? user.imagem : `http://localhost:5002/user-perfil-images/${user.imagem}`}
                    alt="Foto de Perfil"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </button>
            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute bottom-full right-0 mb-1 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-20">
              <div className="p-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300/50 flex items-center justify-center overflow-hidden">
                      {user && user.imagem ? (
                        <img
                          src={user.imagem.startsWith('http') ? user.imagem : `http://localhost:5002/user-perfil-images/${user.imagem}`}
                          alt="Foto de Perfil"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user ? user.nome : 'Usuário'}</p>
                      <p className="text-sm text-gray-500">{user ? user.email : ''}</p>
                    </div>
                  </div>
                </div>
                <nav className="py-2">
                  <Link to="/admin/user-profile" className="flex items-center px-4 py-3 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">Meu perfil</p>
                      </div>
                      <p className="text-sm text-gray-500">Informações do perfil</p>
                    </div>
                  </Link>
                  <Link to="/admin/notifications" className="flex items-center px-4 py-3 hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div>
                      <p className="font-medium">Notificações</p>
                      <p className="text-sm text-gray-500">Mensagens e alertas</p>
                    </div>
                  </Link>
                  <button onClick={logout} className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-gray-50 border-t">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair do sistema
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
