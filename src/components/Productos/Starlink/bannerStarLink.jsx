import Link from "next/link";
import Image from "next/image";

export default function StarlinkMiniBanner() {
  return (
    <section  className="flex bg-gradient-to-b from-blue-800 to-blue-400 p-6 shadow-lg my-8 items-center justify-center" aria-label="Banner de Fuente Adaptador para Antena Starlink Mini">
      <article className="flex justify-between max-w-6xl w-full" role="region"  aria-labelledby="banner-heading" >
        <div className="flex w-full flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6 items-center text-center md:text-start">
            <h2 id="banner-heading" className="text-2xl font-bold text-white mb-2">Fuente Adaptador con cable para Antena <strong>Starlink Mini</strong></h2>
            <p className="text-blue-100 mb-4">Distribuidor autorizado de elevador de tension Trifix SL1230 - Potencia y estabilidad para tu conexión satelital</p>
            <Link href="/productos/StarLinkmini" className="bg-white text-blue-700 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition duration-300" title="Ver detalles del Fuente Adaptador para Antena Starlink Mini" aria-label="Enlace para ver detalles del Fuente Adaptador para Antena Starlink Mini" >
              Ver Detalles
            </Link>
          </div>
          <div className="mx-auto flex justify-center aspect-square">
          <Image
              src="https://res.cloudinary.com/dnbrxpca3/image/upload/f_auto,q_auto/v1739838346/FuenteStarlink4_zodve5.webp"
              alt="Imagen de la Fuente Adaptador para Antena Starlink Mini Trifix SL1230"
              width={380}
              height={380}
              priority
              className="rounded"
              placeholder="blur"
              blurDataURL="/icons/icon-512x512.png"
            />
          </div>
        </div>
      </article>
    </section>
  );
}
