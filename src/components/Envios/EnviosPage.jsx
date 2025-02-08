import { shippingOptions } from '@/app/constants/infoWeb';
import React from 'react';


const EnviosPage = () => {
  return (
    <section
      id="envios-argentina"
      aria-labelledby="envios-argentina-title"
      className="py-8 px-4 bg-gray-50"
    >
      <div className="max-w-screen-lg mx-auto">
        <h2
          id="envios-argentina-title"
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          title="Opciones de Envío en Argentina"
        >
          Opciones de Envío en Argentina
        </h2>
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {shippingOptions.map((option) => (
            <li
              key={option.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={option.icon}
                  alt={`Icono de ${option.name}`}
                  title={option.name}
                  className="w-12 h-12 mr-4"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold text-gray-700">
                  {option.name}
                </h3>
              </div>
              <p className="text-gray-600 mb-2">{option.description}</p>
              <p className="text-gray-800 font-medium">{option.cost}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EnviosPage;
