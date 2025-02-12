/* eslint-disable react/prop-types */
'use client'
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import userData from "@/app/constants/userData";
import Link from "next/link";

// crear userData en /constants
// const userData = {
//   name:'Starcam',
//   contact:2235032141,
//   codigoPais:54,
//   textBoton:'¡Contáctame!',
//   email:'starcaminfo@gmail.com',
//   textoPredefinido:'Hola, me gustaria saber mas sobre, '
// };

// export default userData;

const BotonWsp = ({texto}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(texto?texto:userData.textoPredefinido)}`;

  return (
      <article className="fixed bottom-6 right-6 z-40">
        <Link href={enviar} passHref title="Boton de contacto WhatsApp">
          <a className="flex items-center justify-center bg-green-500 text-white font-bold p-4 rounded-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  aria-label="Contact via WhatsApp" >
            <FaWhatsapp className='text-white text-3xl' aria-label="Boton de contacto WhatsApp" />
            {isHovered && <h2 className='ml-2'>{userData.textBoton}</h2>}
          </a>
        </Link>
      </article>

  );
}

export default BotonWsp;
