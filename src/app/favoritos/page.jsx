import dynamic from 'next/dynamic';

const ListaFavoritos = dynamic(() => import('../../components/Tienda/Favoritos/ListaFavoritos'));
const ClientLayout = dynamic(() => import('../ClientLayout'));

export const metadata = {
  title: 'Mis favoritos | Eshop Devices',
  description: 'Los productos que guardaste para comprar después.',
  robots: { index: false, follow: true }, // es una lista personal del visitante
};

export default function FavoritosPage() {
  return (
    <ClientLayout>
      <main className="bg-white">
        <ListaFavoritos />
      </main>
    </ClientLayout>
  );
}
