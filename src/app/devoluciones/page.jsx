import Link from 'next/link';
import PaginaLegal, { Seccion } from '../../components/Legal/PaginaLegal';
import { defaultMetadata } from '../../lib/metadata';
import { empresa, devoluciones } from '../constants/politicas';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const title = 'Política de devoluciones y cambios | Eshop Devices';
const description = `Devoluciones dentro de los ${devoluciones.plazoDias} días corridos de recibido el pedido. Conocé cómo devolver o cambiar un producto comprado en Eshop Devices.`;

export const metadata = {
  ...defaultMetadata,
  metadataBase: new URL(SITE),
  title,
  description,
  alternates: { canonical: `${SITE}/devoluciones` },
  openGraph: { ...defaultMetadata.openGraph, title, description, url: `${SITE}/devoluciones` },
  twitter: { ...defaultMetadata.twitter, title, description },
  robots: { index: true, follow: true },
};

export default function DevolucionesPage() {
  return (
    <PaginaLegal
      titulo="Política de devoluciones y cambios"
      bajada={`Tenés ${devoluciones.plazoDias} días corridos para revocar tu compra desde que recibís el pedido.`}
      ruta="/devoluciones"
      actualizado="noviembre de 2026"
    >
      <Seccion titulo="Plazo">
        <p>
          Podés solicitar la devolución de un producto dentro de los{' '}
          <strong>{devoluciones.plazoDias} días corridos</strong> contados desde que recibís el pedido.
          Corresponde al derecho de revocación del artículo 34 de la Ley 24.240 de Defensa del
          Consumidor para compras realizadas a distancia. No necesitás justificar el motivo.
        </p>
      </Seccion>

      <Seccion titulo="Estado en que debe volver el producto">
        <p>
          El producto tiene que estar sin uso, con su embalaje original y con todos los accesorios
          que venían con él. Los productos usados que se publican como tales se revisan al recibirlos.
        </p>
      </Seccion>

      <Seccion titulo="Cómo iniciar la devolución">
        <ol className="ml-5 list-decimal space-y-1">
          <li>
            Escribinos por{' '}
            <a href={empresa.whatsapp} className="text-orange-600 underline" target="_blank" rel="noopener noreferrer">
              WhatsApp al {empresa.telefonoLegible}
            </a>{' '}
            o a <a href={`mailto:${empresa.email}`} className="text-orange-600 underline">{empresa.email}</a>,
            indicando el número de pedido y el código del producto.
          </li>
          <li>Te confirmamos la devolución y coordinamos cómo hacérnosla llegar.</li>
          <li>Al recibir el producto verificamos su estado.</li>
          <li>Te devolvemos el dinero o te enviamos un reemplazo, según prefieras.</li>
        </ol>
      </Seccion>

      <Seccion titulo="Reintegro del dinero">
        <p>
          Una vez recibido y verificado el producto, el reintegro se realiza dentro de los{' '}
          <strong>{devoluciones.plazoReintegroDias} días corridos</strong> por el mismo medio de pago
          que usaste.
        </p>
      </Seccion>

      <Seccion titulo="Productos fallados o equivocados">
        <p>
          Si el producto llegó dañado, con una falla o no es el que pediste, avisanos apenas lo
          recibas y lo reemplazamos o te devolvemos el importe.
        </p>
      </Seccion>

      <Seccion titulo="Contacto">
        <p>
          {empresa.nombre} — CUIT {empresa.cuit}<br />
          {empresa.direccion}, {empresa.provincia}<br />
          Tel/WhatsApp: {empresa.telefonoLegible} — {empresa.email}
        </p>
        <p>
          Ver también <Link href="/envios" className="text-orange-600 underline">envíos</Link> y{' '}
          <Link href="/contacto" className="text-orange-600 underline">datos de contacto</Link>.
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
