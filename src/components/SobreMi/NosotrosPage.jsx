'use client'
import React from 'react';
import { infoWeb, shippingOptions, faqData } from '@/app/constants/infoWeb';

const NosotrosPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Sección: Acerca de Nosotros */}
      <section
        id="acerca-de-nosotros"
        aria-labelledby="acerca-nosotros-heading"
        className="mb-12"
      >
        <header className="text-center">
          <h1
            id="acerca-nosotros-heading"
            className="text-4xl font-bold"
            title={infoWeb.title}
          >
            {infoWeb.title}
          </h1>
          <p
            className="text-xl mt-2"
            title={infoWeb.subtitle}
          >
            {infoWeb.subtitle}
          </p>
        </header>
        <article className="mt-6 text-justify">
          {/* Se utiliza dangerouslySetInnerHTML ya que infoWeb.sobremi contiene HTML controlado */}
          <div
            dangerouslySetInnerHTML={{ __html: infoWeb.sobremi }}
            title="Sobre Eshop Devices"
            aria-label="Sobre Eshop Devices"
          />
        </article>
      </section>

      {/* Sección: Qué Ofrecemos */}
      <section
        id="que-ofrecemos"
        aria-labelledby="que-ofrecemos-heading"
        className="mb-12"
      >
        <h2
          id="que-ofrecemos-heading"
          className="text-3xl font-semibold text-center"
          title="Qué Ofrecemos"
        >
          Qué Ofrecemos
        </h2>
        <ul className="mt-4 list-disc list-inside">
          {infoWeb.ofrece.map((item, index) => (
            <li key={index} className="text-lg" title={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Sección: Opciones de Envío */}
      <section
        id="opciones-envio"
        aria-labelledby="envio-heading"
        className="mb-12"
      >
        <h2
          id="envio-heading"
          className="text-3xl font-semibold text-center"
          title="Opciones de Envío"
        >
          Opciones de Envío
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <h3
                  className="text-xl font-semibold text-gray-700"
                  title={option.name}
                >
                  {option.name}
                </h3>
              </div>
              <p
                className="text-gray-600 mb-2"
                title={option.description}
              >
                {option.description}
              </p>
              {option.cost && (
                <p
                  className="text-gray-800 font-medium"
                  title={option.cost}
                >
                  {option.cost}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Preguntas Frecuentes */}
      <section
        id="preguntas-frecuentes"
        aria-labelledby="faq-heading"
        className="mb-12"
      >
        <h2
          id="faq-heading"
          className="text-3xl font-semibold text-center"
          title="Preguntas Frecuentes"
        >
          Preguntas Frecuentes
        </h2>
        <div className="mt-6 space-y-6">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <h3 className="text-xl font-bold" title={faq.question}>
                {faq.question}
              </h3>
              <p className="text-gray-700 mt-2" title={faq.answer}>
                {faq.answer}
              </p>
              {faq.linkText && faq.linkUrl && (
                <a
                  href={faq.linkUrl}
                  className="text-blue-600 hover:underline inline-block mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={faq.linkText}
                  aria-label={faq.linkText}
                >
                  {faq.linkText}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Contáctanos */}
      <section
        id="contacto"
        aria-labelledby="contacto-heading"
        className="mb-12 text-center"
      >
        <h2
          id="contacto-heading"
          className="text-3xl font-semibold"
          title="Contáctanos"
        >
          Contáctanos
        </h2>
        <p
          className="mt-4 text-lg"
          title="Comunícate con nosotros para cualquier consulta"
        >
          Si tienes alguna consulta, no dudes en comunicarte con nosotros.
        </p>
        <a
          href={`https://wa.me/+${infoWeb.codigoPais}${infoWeb.contact}`}
          className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
          target="_blank"
          rel="noopener noreferrer"
          title="Contactar por WhatsApp"
          aria-label="Contactar a Eshop Devices por WhatsApp"
        >
          Enviar Mensaje por WhatsApp
        </a>
      </section>
    </main>
  );
};

export default NosotrosPage;
