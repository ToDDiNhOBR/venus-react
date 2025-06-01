import React, { useState, useEffect } from 'react';

const images = [
  {
    src: "/images/gallery/colonial.jpeg",
    caption: "Telha Térmica Colonial"
  },
  {
    src: "/images/gallery/chale.jpeg",
    caption: "Chalés"
  },
  {
    src: "/images/gallery/isotelha-preta.jpeg",
    caption: "Cobertura"
  },
  {
    src: "/images/gallery/ripado.jpeg",
    caption: "Ripados"
  },
  {
    src: "/images/gallery/telha-forro.jpeg",
    caption: "Telha Forro"
  },
  {
    src: "/images/gallery/ripados.jpeg",
    caption: "Ripados"
  },
  {
    src: "/images/gallery/forro-branco.jpeg",
    caption: "Forro em aço branco"
  },
  {
    src: "/images/gallery/painel.jpeg",
    caption: "Painéis térmicos"
  },
  {
    src: "/images/gallery/madeirado.jpeg",
    caption: "Forro Amadeirado"
  },
  {
    src: "/images/gallery/fechamento.jpeg",
    caption: "Fechamento em aço"
  },
  {
    src: "/images/gallery/termica-composicao.jpeg",
    caption: "Composição telha sanduíche"
  },
  {
    src: "/images/gallery/residence-instalada.jpeg",
    caption: "Telha Residence"
  },
  {
    src: "/images/gallery/residence.jpeg",
    caption: "Medidas telha residence"
  },
  {
    src: "/images/gallery/galva-instalada.jpeg",
    caption: "Cobertura"
  },
  {
    src: "/images/gallery/composicao-colonial.jpeg",
    caption: "Composição telha Colonial"
  },
  {
    src: "/images/gallery/painel-termico.jpeg",
    caption: "Painel Térmico"
  }
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setFade(true);
    }, 300);
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setFade(true);
    }, 300);
  };

  return (
    <section className="relative bg-gradient-to-r from-[#051d40] via-[#051d40] via-80% to-white py-16 px-6 animate-fadeIn">
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-white drop-shadow-lg">
          Explore nossas soluções: qualidade e inovação em cada construção realizada pela Vênus Soluções integradas
        </h2>
        <div className="relative w-full max-w-4xl mx-auto">
          <div
            className={`overflow-hidden rounded-lg shadow-2xl transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col bg-[#f0f0f0]">
              <div className="p-4 pb-1 flex items-center justify-center min-h-[400px]">
                <img
                  src={images[currentIndex].src}
                  alt={`Gallery Image ${currentIndex + 1}`}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain mx-auto"
                />
              </div>
              <div className="bg-[#051d40] bg-opacity-90 text-white text-center py-2 text-lg font-semibold">
                {images[currentIndex].caption}
              </div>
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#051d40] font-bold py-3 px-5 rounded-r-lg shadow-lg"
            aria-label="Previous Slide"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-[#051d40] font-bold py-3 px-5 rounded-l-lg shadow-lg"
            aria-label="Next Slide"
          >
            &#10095;
          </button>
          <div className="flex justify-center mt-20 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-4 h-4 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-blue-300'
                } shadow-md`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#051d40] via-[#051d40] to-[#051d40] opacity-80 -z-10" aria-hidden="true" />
    </section>
  );
};

export default Gallery;
