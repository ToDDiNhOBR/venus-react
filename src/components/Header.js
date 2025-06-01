import React, { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white bg-opacity-95 backdrop-blur-sm shadow-xl' 
        : 'bg-white bg-opacity-90 backdrop-blur-sm shadow-md'
    }`}>
      <div className="container mx-auto flex items-center justify-between py-3 px-6 transition-all duration-300">
        <a href="/" aria-label="Venus Soluções Integradas" className="flex items-center transform hover:scale-105 transition-transform duration-300">
          <img
            src="https://img1.wsimg.com/isteam/ip/3c0378ac-c8f5-41de-bd1a-328f8aa0bea1/TERMOFLEX%20REPRESENTA%C3%87%C3%95ES%20(2).png/:/rs=h:200,cg:true,m/qt=q:95"
            alt="Venus Soluções Integradas"
            className="h-24 w-auto"
          />
        </a>
        <div className="flex items-center gap-4">
          <a
          href="https://wa.me/5562991182726"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 transition-all duration-300 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            Solicite seu orçamento
          </span>
        </a>
        <a
          href="/login"
          className="inline-block bg-gray-800 hover:bg-gray-700 transition-all duration-300 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Admin
        </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
