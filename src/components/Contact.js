import React from 'react';

const Contact = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">Faça seu orçamento hoje!</h2>
        <p className="mb-6">
          Nossos clientes são importantes para nós. Ficaríamos contentes em receber a sua visita durante nosso horário comercial, ou de receber sua mensagem pelo WhatsApp.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://wa.me/5562991182726"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-md shadow-lg"
          >
            <i className="fab fa-whatsapp fa-lg mr-2"></i> Faça seu Orçamento
          </a>
          <a
            href="mailto:contato@venussolucoes.com"
            className="flex items-center inline-block bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 transition text-white font-semibold px-8 py-4 rounded-md shadow-lg"
          >
            <i className="fas fa-envelope fa-lg mr-2"></i> Envie uma mensagem
          </a>
        </div>
        <div className="mt-6">
          <p>Endereço: R.RIACHO FUNDO I QN5 CJ4 LT40, S/N RIACHO FUNDO I -DF</p>
          <p>
            WhatsApp:{' '}
            <a 
              href="https://wa.me/5562991182726" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              62 99118-2726
            </a>
          </p>
          <p>
            Email:{' '}
            <a href="mailto:contato@venussolucoes.com" className="text-blue-700 hover:underline">
              contato@venussolucoes.com
            </a>
          </p>
          <p>Horário de atendimento: Segunda a Sexta 07:00 - 18:00, Sábado 08:00 - 12:00</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
