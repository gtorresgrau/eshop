import { ImageResponse } from 'next/og';
import fetchProduct from './fetchProduct';

export const runtime = 'edge'; // Recomendado para mejor rendimiento

export default async function GET(req: Request, { params }: { params: { nombre: string } }) {
  const product = await fetchProduct(params.nombre);

  if (!product) {
    return new Response('Not Found', { status: 404 });
  }

  // URL de la imagen en JPG
  const imagenUrlJPG = product.foto_1_1
    ? product.foto_1_1.replace('.webp', '.jpg')
    : 'https://tusitio.com/default-image.jpg';

  return new ImageResponse(
    (
      <div className="flex w-[1200px] h-[630px] bg-white items-center justify-center text-[48px] font-bold text-gray-900">
        <img
          src={imagenUrlJPG}
          alt={product.nombre}
          className="w-full h-full object-cover"
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
