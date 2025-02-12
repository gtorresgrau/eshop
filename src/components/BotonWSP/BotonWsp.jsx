/* eslint-disable react/prop-types */
'use client'
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import userData from "@/app/constants/userData";

const BotonWsp = ({ texto }) => {
  const [isHovered, setIsHovered] = useState(false);

  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(texto || userData.textoPredefinido)}`;

  return (
    <article className="fixed bottom-6 right-6 z-40">
      <a 
        href={enviar} 
        target="_blank" 
        rel="noopener noreferrer" 
        title="Botón de contacto WhatsApp"
        className="flex items-center justify-center bg-green-500 text-white font-bold p-4 rounded-full"
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        aria-label="Contact via WhatsApp"
      >
        <FaWhatsapp className="text-white text-3xl" aria-label="Botón de contacto WhatsApp" />
        {isHovered && <h2 className="ml-2">{userData.textBoton}</h2>}
      </a>
    </article>
  );
}

export default BotonWsp;
