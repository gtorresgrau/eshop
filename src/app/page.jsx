import { Suspense } from 'react';
import ClientLayout from './ClientLayout';
import { defaultMetadata } from '../lib/metadata';
import { contarProductos, productosParaHero } from '../lib/catalogo';
import { getProductPath } from '../Utils/productSlug';
import { parsePrecio } from '../Utils/parsePrecio';
import { fotoLiviana } from '../Utils/fotoNB';
import { formatearTitulo } from '../Utils/formatoTitulo';

import HeroObjeto from '../components/Home/HeroObjeto';
import Productos from '../components/Tienda/Productos';
import ComoComprar from '../components/Home/ComoComprar';
import SeccionStarlink from '../components/Home/SeccionStarlink';
import ServiciosHome from '../components/Home/ServiciosHome';
import GuiasHome from '../components/Home/GuiasHome';
import HerramientaHome from '../components/Home/HerramientaHome';
import NosotrosHome from '../components/Home/NosotrosHome';
import FaqHome from '../components/Home/FaqHome';
import ContactoHome from '../components/Home/ContactoHome';

// La portada se regenera cada hora: cambia la cuenta de productos y los objetos del hero
export const revalidate = 3600;

export function generateMetadata() {
  return defaultMetadata;
}

const STARLINK_FOTO = 'https://res.cloudinary.com/dnbrxpca3/image/upload/f_auto,q_auto,w_900/v1739838346/FuenteStarlink4_zodve5.webp';
const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

async function datosPortada() {
  try {
    const [total, hero] = await Promise.all([contarProductos(), productosParaHero(3)]);
    return { total, hero };
  } catch (e) {
    console.error('[home] datos de portada:', e?.message);
    return { total: 0, hero: [] };
  }
}

export default async function HomePage() {
  const { total, hero } = await datosPortada();

  // Primer objeto: lo que solo distribuye esta tienda. Después, productos reales del catálogo.
  const objetos = [
    {
      key: 'starlink',
      href: '/productos/StarLinkmini',
      nombre: 'Fuente para Starlink Mini',
      marca: 'Distribuidor autorizado',
      precio: '',
      src: STARLINK_FOTO,
      alt: 'Fuente adaptador con cable para antena Starlink Mini, Trifix SL1230',
    },
    ...hero.map((p) => {
      const precio = parsePrecio(p.precio);
      const nombre = formatearTitulo(p.titulo_de_producto || p.nombre);
      return {
        key: p.cod_producto,
        href: getProductPath(p),
        nombre,
        marca: p.marca || '',
        precio: precio > 0 ? ars.format(precio) : '',
        src: fotoLiviana(p.foto_1_1),
        alt: nombre,
      };
    }),
  ];
  const fotosPasos = hero.map((p) => fotoLiviana(p.foto_1_1));

  return (
    <ClientLayout>
      <main>
        <HeroObjeto objetos={objetos} total={total} />
        {/* Catálogo con menú lateral de filtros (cliente: lee y filtra con los parámetros de la URL) */}
        <Suspense fallback={<div id="productos" className="min-h-screen" />}>
          <Productos />
        </Suspense>
        <ComoComprar total={total} fotos={fotosPasos} />
        <SeccionStarlink />
        <ServiciosHome />
        <GuiasHome />
        <HerramientaHome />
        <NosotrosHome />
        <FaqHome />
        <ContactoHome />
      </main>
    </ClientLayout>
  );
}
