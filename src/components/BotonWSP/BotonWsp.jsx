/* eslint-disable react/prop-types */
'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const BotonWsp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactos, setContactos] = useState([]);

  // Fetch de la config desde la API local
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data?.ventas && data?.administracion) {
          setContactos([data.administracion, data.ventas]);
        }
      } catch (err) {
        console.error('Error cargando configuración:', err);
      }
    };

    fetchConfig();
  }, []);

  const generarLink = (contacto, codigoPais, texto) =>
    `https://wa.me/+${codigoPais}${contacto}?text=${encodeURIComponent(texto)}`;

  return (
    <article className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Lista de contactos */}
      <div
        className={`flex flex-col gap-2 mb-2 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {contactos.map((c) => (
          <a
            key={c.label}
            href={generarLink(c.contacto, c.codigoPais, c.textoPredefinido)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Chatear con ${c.label}`}
          >
            <button className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition">
              {c.label}
            </button>
          </a>
        ))}
      </div>

      {/* Botón principal */}
      <button
        className="flex items-center justify-center bg-green-500 text-white font-bold p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        aria-label="Contacto por WhatsApp"
        title="Abrir opciones de contacto por WhatsApp"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaWhatsapp className="text-white text-3xl" />
      </button>
    </article>
  );
};

export default BotonWsp;