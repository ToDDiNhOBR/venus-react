import React from 'react';
import AboutCard from './AboutCard';

const About = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Sobre Vênus Soluções Integradas</h2>
        <div className="grid md:grid-cols-3 gap-10 text-gray-700">
          <AboutCard
            image="https://img1.wsimg.com/isteam/stock/8206/:/rs=w:365,h:365,cg:true"
            alt="Nossa Missão"
            title="Nossa Missão"
          >
            Na Vênus Soluções Integradas, nossa missão é fornecer produtos de alta qualidade, como telhas, painéis térmicos e fechamentos em aço galvalume, aliados a serviços de instalação profissional, para garantir conforto, durabilidade e eficiência aos nossos clientes. Queremos ser a escolha preferida de quem busca soluções integradas para construção e reforma, superando expectativas e construindo relacionamentos de confiança.
          </AboutCard>
          <AboutCard
            image="https://img1.wsimg.com/isteam/getty/1511226415/:/rs=w:365,h:365,cg:true"
            alt="Nossa Visão"
            title="Nossa Visão"
          >
            Ser reconhecida como referência no mercado de coberturas e fechamentos, destacando-nos pela qualidade dos nossos produtos, excelência no atendimento e compromisso com a inovação. Almejamos expandir nossa atuação, levando soluções térmicas e estruturais para todo o Brasil, sempre com foco na sustentabilidade e na satisfação dos nossos clientes.
          </AboutCard>
          <AboutCard
            image="https://img1.wsimg.com/isteam/getty/1924766978/:/rs=w:365,h:365,cg:true"
            alt="Nossos Valores"
            title="Nossos Valores"
          >
            Na Vênus Soluções Integradas, valorizamos a <strong>qualidade</strong> em nossos produtos e serviços, agimos com <strong>integridade</strong> em todas as relações e buscamos a <strong>inovação</strong> para oferecer as melhores soluções. Comprometemo-nos com a <strong>sustentabilidade</strong>, priorizamos o <strong>atendimento personalizado</strong> e acreditamos no poder do <strong>trabalho em equipe</strong> para alcançar resultados excepcionais.
          </AboutCard>
        </div>
      </div>
    </section>
  );
};

export default About;
