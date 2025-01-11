import React from "react";
import Link from "next/link";
import LogoBlanco from '../../../public/logos/LogoCentral.webp'
import Redes from "@/app/constants/Redes";

export default function Footer() {
  
  let tamañoRedes = {alto:45, ancho:45}

  return (
    <footer className="p-4 md:p-8 lg:p-10 bg-secondary-background">
      <div className="mx-auto max-w-screen-xl text-center">
        <Link href="/" className="flex flex-col justify-center items-center text-2xl font-semibold  text-white" title="CentralCam Logo">
          <img src={LogoBlanco.src} height={150} width={150} alt="CentralCam Logo" loading='lazy' title="CentralCam Logo"/>
        </Link>
        <Redes height={tamañoRedes.alto} width={tamañoRedes.ancho} />
        <span className="text-sm sm:text-center text-gray-300">© 2024{" "}<Link href="https://programundo.dev" className="hover:underline" title="https://programundo.dev">Programundo</Link>. All Rights Reserved.</span>
      </div>
    </footer>
  );
}
