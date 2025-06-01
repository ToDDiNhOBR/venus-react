import React, { useState } from 'react';
import { submitEmail } from '../api/subscribe';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Submit email to backend
      await submitEmail(email);
      
      // Download the PDF catalog
      const pdfUrl = '/catalogo-venus-solucoes.pdf';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Catalogo-Venus-Solucoes.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset form
      setEmail('');
      alert('Obrigado! Seu catálogo está sendo baixado.');
    } catch (error) {
      console.error('Error:', error);
      alert('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-6">Baixe Nosso Catálogo</h2>
        <p className="mb-6">Digite seu e-mail para baixar nosso catálogo completo em PDF.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-block bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 transition text-white font-semibold px-8 py-4 rounded-md shadow-lg ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processando...' : 'Baixar Catálogo'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Subscribe;
