import React from 'react';

const Section = ({ title, description, link, imgSrc, imgAlt, reverse }) => {
  return (
    <div className={`w-11/12 py-10 mx-auto flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10`}>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg">{description}</p>
        <div className="mt-8 w-fit bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg">
            <a href={link}>
            Ver más
            </a>
        </div>
      </div>
      <div className="md:w-1/2">
        <img src={imgSrc} alt={imgAlt} className="rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default Section;
