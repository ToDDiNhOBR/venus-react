import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-8 text-center text-gray-600 text-sm">
      <p>Copyright © 2025 Vênus Soluções – Todos os direitos reservados.</p>
      <div className="mt-4">
        <a
          href="https://www.instagram.com/venus_solucoesintegradas?igsh=ZDd2dm42Z2t4ODIx"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="inline-block text-pink-600 hover:text-pink-700 transition"
        >
          <i className="fab fa-instagram fa-2x"></i>
        </a>
      </div>
      <p className="mt-4">Desenvolvido por ToDDiNhOBR</p>
    </footer>
  );
};

export default Footer;
