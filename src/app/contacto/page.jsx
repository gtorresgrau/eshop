import Link from 'next/link';
import PaginaLegal, { Seccion } from '../../components/Legal/PaginaLegal';
import { defaultMetadata } from '../../lib/metadata';
import { empresa } from '../constants/politicas';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const title = 'Contacto | Eshop Devices';
const description = `Contactate con Eshop Devices: ${empresa.direccion}. WhatsApp ${empresa.telefonoLegible} y ${empresa.email}.`;

export const metadata = {
  ...defaultMetadata,
  metadataBase: new URL(SITE),
  title,
  description,
  alternates: { canonical: `${SITE}/contacto` },
  openGraph: { ...defaultMetadata.openGraph, title, description, url: `${SITE}/contacto` },
  twitter: { ...defaultMetadata.twitter, title, description },
  robots: { index: true, follow: true },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ComputerStore',
  name: empresa.nombre,
  url: SITE,
  email: empresa.email,
  telephone: empresa.telefono,
  taxID: empresa.cuit,
  address: {
    '@type': 'PostalAddress',
    streetAddress: empresa.calle,
    addressLocality: empresa.localidad,
    addressRegion: empresa.provincia,
    addressCountry: empresa.pais,
  },
};

export default function ContactoPage() {
  return (
    <PaginaLegal
      titulo="Contacto"
      bajada="Escribinos y te respondemos a la brevedad."
      ruta="/contacto"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />

      <Seccion titulo="Datos de la empresa">
        <p>
          <strong>{empresa.nombre}</strong><br />
          CUIT {empresa.cuit}<br />
          {empresa.direccion}, {empresa.provincia}
        </p>
      </Seccion>

      <Seccion titulo="Cómo comunicarte">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            WhatsApp:{' '}
            <a href={empresa.whatsapp} className="text-orange-600 underline" target="_blank" rel="noopener noreferrer">
              {empresa.telefonoLegible}
            </a>
          </li>
          <li>
            Email: <a href={`mailto:${empresa.email}`} className="text-orange-600 underline">{empresa.email}</a>
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="Más información">
        <p>
          <Link href="/envios" className="text-orange-600 underline">Envíos</Link> ·{' '}
          <Link href="/devoluciones" className="text-orange-600 underline">Devoluciones</Link>
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
