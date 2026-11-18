import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <section className="p-4 md:p-8 lg:p-10 bg-secondary-background min-h-[80px] flex items-center">
      <div className="mx-auto max-w-screen-xl text-center">
        <nav aria-label="Enlaces del sitio" className="mb-3">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-300">
            <li><Link href="/productos" className="hover:underline">Catálogo</Link></li>
            <li><Link href="/nosotros" className="hover:underline">Nosotros</Link></li>
            <li><Link href="/envios" className="hover:underline">Envíos</Link></li>
            <li><Link href="/devoluciones" className="hover:underline">Devoluciones</Link></li>
            <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
          </ul>
        </nav>
        <span className="text-sm sm:text-center text-gray-300">
          © 2025{" "}
          <Link 
            href="https://gonzalotorresgrau.com" 
            className="hover:underline" 
            title="Gonzalo Torres Grau"
          >
            Gonzalo Torres Grau
          </Link>. All Rights Reserved.
        </span>
      </div>
    </section>
  );
}
