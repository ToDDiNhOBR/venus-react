import React from 'react';
import { Link } from 'react-router-dom';

const HomeView = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 backdrop-blur-3xl"></div>
      
      {/* Main Circle */}
      <div className="relative">
        {/* Outer rotating circle */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin-slow opacity-30"></div>
        
        {/* Main circle content */}
        <div className="relative w-[500px] h-[500px] bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-full border border-gray-700 backdrop-blur-xl flex items-center justify-center shadow-2xl">
          {/* Center content */}
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Venus Admin
            </h1>
            <p className="text-gray-400">Sistema de Gestão</p>
          </div>

          {/* Left Button - Orçamentos */}
          <div className="absolute left-0 -translate-x-1/2">
            <Link
              to="/admin/quotations"
              className="group relative flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Orçamentos</span>
                </div>
              </div>
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-3 py-1 bg-gray-900/90 rounded-full text-blue-400 text-sm whitespace-nowrap shadow-lg border border-blue-500/20">
                  Gerenciar Orçamentos
                </span>
              </div>
            </Link>
          </div>

          {/* Right Button - Clientes */}
          <div className="absolute right-0 translate-x-1/2">
            <Link
              to="/admin/clients"
              className="group relative flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium">Clientes</span>
                </div>
              </div>
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-3 py-1 bg-gray-900/90 rounded-full text-purple-400 text-sm whitespace-nowrap shadow-lg border border-purple-500/20">
                  Gerenciar Clientes
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
    </div>
  );
};

export default HomeView;
