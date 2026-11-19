import React from "react";
import Link from "next/link";
import userData from "../constants/userData";

const ENLACES = [
  { href: '/productos', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/envios', label: 'Envíos' },
  { href: '/devoluciones', label: 'Devoluciones' },
  { href: '/#contacto', label: 'Contacto' },
];

/**
 * Cierre diseñado: el nombre vuelve a todo el ancho, con el menú y los datos de contacto debajo.
 * Se usa en todas las páginas (FooterSection).
 */
export default function Footer() {
  return (
    <section className="bg-[#2C2F33] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
          <nav aria-label="Enlaces del sitio">
            <ul className="space-y-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="transition-colors hover:text-orange-300 focus:outline-none focus-visible:underline">{e.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-5 text-lg text-gray-100">
            <p>{userData.direccion}</p>
            <p><a href={`mailto:${userData.email}`} className="underline-offset-2 hover:underline">{userData.email}</a></p>
            <p><a href={`tel:+${userData.codigoPais}${userData.contact}`} className="underline-offset-2 hover:underline">+{userData.codigoPais} {userData.contact}</a></p>
          </div>
        </div>

        <p aria-hidden="true" className="mt-16 select-none whitespace-nowrap text-center text-[11.2vw] font-black leading-[0.9] tracking-[-0.045em] text-white/90">
          Eshop Devices
        </p>

        <p className="mt-8 text-base text-gray-300">
          © {new Date().getFullYear()}{" "}
          <Link href="https://gonzalotorresgrau.com" className="hover:underline" title="Gonzalo Torres Grau">
            Gonzalo Torres Grau
          </Link>
          . Todos los derechos reservados.
        </p>
      </div>
    </section>
  );
}
