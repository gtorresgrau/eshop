'use client'
import React from 'react';
import { infoWeb, shippingOptions, someProducts } from '@/app/constants/infoWeb';
import PreguntasFrecuentes from '../PreguntasFrecuentas/PreguntasFrecuentas';
import useProducts from '@/Hooks/useProducts';

const NosotrosPage = () => {
  const {products } = useProducts();

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Sección: Acerca de Nosotros */}
      <section id="acerca-de-nosotros" aria-labelledby="acerca-nosotros-heading" className="mb-12">
        <header className="text-center">
          <h1 id="acerca-nosotros-heading" className="text-4xl font-bold" title={infoWeb.title}>
            {infoWeb.title}
          </h1>
          <p className="text-xl mt-2" title={infoWeb.subtitle}>
            {infoWeb.subtitle}
          </p>
        </header>
        <article className="mt-6 text-justify">
          <div title="Sobre Eshop Devices" aria-label="Sobre Eshop Devices">
            <strong className="text-red-600 font-bold">ESHOP DEVICES</strong>, es una Startup joven que nos dedicamos a la venta de insumos informáticos. Trabajamos por WhatsApp para entregas en persona y MercadoShops para quienes quieren envíos.
          </div>
        </article>
      </section>

      {/* Sección: Qué Ofrecemos */}
      <section id="que-ofrecemos" aria-labelledby="que-ofrecemos-heading" className="mb-12">
        <h2 id="que-ofrecemos-heading" className="text-3xl font-semibold text-center" title="Qué Ofrecemos">
          ¿Qué productos ofrecemos?
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products
          .sort(() => Math.random() - 0.5) // Mezcla aleatoriamente los productos
          .slice(0, 6) // Toma los primeros 6 productos
          .map((prod, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2" title={prod.nombre}>
                  {prod.nombre}
                </h3>
                <p className='text-gray-600'>
                  {prod.descripcion.length > 150 ? `${prod.descripcion.slice(0, 150)}...` : prod.descripcion}
                </p>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Opciones de Envío */}
      <section id="opciones-envio" aria-labelledby="envio-heading" className="mb-12">
        <h2 id="envio-heading" className="text-3xl font-semibold text-center" title="Opciones de Envío">
          Opciones de Envío
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {shippingOptions.map((option) => (
            <div key={option.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2" title={option.name}>
                  {option.name}
                </h3>
                <p className="text-gray-600 mb-2" title={option.description}>{option.description}</p>
                {option.cost && (
                  <p className="text-gray-800 font-medium text-lg" title={option.cost}>{option.cost}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Preguntas Frecuentes */}
      <PreguntasFrecuentes />
    </main>
  );
};

export default NosotrosPage;