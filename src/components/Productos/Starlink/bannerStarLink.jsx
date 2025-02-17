import Link from "next/link";
import Image from "next/image";

export default function StarlinkMiniBanner() {
  return (
    <section
      className="flex bg-gradient-to-b from-blue-800 to-blue-400 p-6 shadow-lg my-8 items-center justify-center"
      aria-label="Banner de Fuente Adaptador para Antena Starlink Mini"
    >
      <article
        className="flex justify-between max-w-6xl w-full"
        role="region"
        aria-labelledby="banner-heading"
      >
        <div className="flex w-full flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6 items-center text-center md:text-start">
            <h2 id="banner-heading" className="text-2xl font-bold text-white mb-2">
              Fuente Adaptador para Antena Starlink Mini
            </h2>
            <p className="text-blue-100 mb-4">
              Trifix SL1230 - Potencia y estabilidad para tu conexión satelital
            </p>
            <Link
              href="/productos/StarLinkmini"
              className="bg-white text-blue-700 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition duration-300"
              title="Ver detalles del Fuente Adaptador para Antena Starlink Mini"
              aria-label="Enlace para ver detalles del Fuente Adaptador para Antena Starlink Mini"
            >
              Ver Detalles
            </Link>
          </div>
          <div className="w-full md:w-1/3 mx-auto flex justify-center">
            <Image
              src="https://res.cloudinary.com/dnbrxpca3/image/upload/v1739669129/Products/c2f8qg6uaoqgsiiukhp0.webp"
              alt="Imagen de la Fuente Adaptador para Antena Starlink Mini Trifix SL1230"
              title="Imagen de la Fuente Adaptador para Antena Starlink Mini Trifix SL1230"
              aria-label="Imagen de la Fuente Adaptador para Antena Starlink Mini Trifix SL1230"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      </article>
    </section>
  );
}
