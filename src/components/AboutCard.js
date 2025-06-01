import React from 'react';

const AboutCard = ({ image, alt, title, children }) => {
  return (
    <div className="space-y-4">
      <img src={image} alt={alt} className="w-full rounded-md shadow-md" />
      <h4 className="text-xl font-semibold">{title}</h4>
      <p>{children}</p>
    </div>
  );
};

export default AboutCard;
