import React from "react";
import Link from "next/link";
import LogoBlanco from '../../../public/logos/logoEshop.webp';
import Redes from "@/app/constants/Redes";

export default function Footer() {
  
  let tamañoRedes = {alto:45, ancho:45}

  return (
    <footer className="p-4 md:p-8 lg:p-10 bg-secondary-background">
      <div className="mx-auto max-w-screen-xl text-center">
        {/* <Link href="/" className="flex flex-col justify-center items-center text-2xl font-semibold rounded-full  text-white" title="eshopDevices Logo">
          <img src={LogoBlanco.src} height={150} width={150} alt="CentralCam Logo" loading='lazy' title="eshopDevices Logo" className="rounded-full"/>
        </Link>
        <Redes height={tamañoRedes.alto} width={tamañoRedes.ancho} /> */}
        <span className="text-sm sm:text-center text-gray-300">© 2025{" "}<Link href="https://gonzalotorresgrau.com" className="hover:underline" title="https://gonzalotorresgrau.com">Gonzalo Torres Grau</Link>. All Rights Reserved.</span>
      </div>
    </footer>
  );
}
