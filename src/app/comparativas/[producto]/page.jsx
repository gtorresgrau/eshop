import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";

const HeaderSection = dynamic(()=>import ( "@/app/home/HeaderSection"))
const FooterSection = dynamic(()=>import ( "@/app/home/FooterSection"))
const Loading = dynamic(()=>import ( "@/components/Loading/Loading"))

// Mapeo de los componentes según el producto
const comparisonComponents = {
  almacenamiento: dynamic(() => import("@/components/Comparativas/Almacenamiento/AlmacenamientoPage")),
  memoria: dynamic(() => import("@/components/Comparativas/MemoriaRam/MemoriaRamPage")),
  fuente: dynamic(() => import("@/components/Comparativas/Fuentes/FuentePage")),
};

const ComparativaPage = ({ producto }) => {
  // Si el producto no existe en el mapeo, devuelve 404
  if (!comparisonComponents[producto]) {
    notFound();
  }

  const SelectedComponent = comparisonComponents[producto];

  return (
    <div className="flex flex-col h-screen">
      <HeaderSection />
        <main className="flex-1 flex items-center justify-center bg-white">
        <Suspense fallback={<Loading />}>
          <SelectedComponent />
        </Suspense>
      </main>
      <FooterSection />
    </div>
  );
};

export default ComparativaPage;


// Genera las rutas estáticas para cada tipo de comparación
export async function getStaticPaths() {
  const paths = [
    { params: { producto: 'almacenamiento' } },
    { params: { producto: 'memoria' } },
    { params: { producto: 'fuente' } },
  ];

  return {
    paths,
    fallback: false, // O "blocking" si prefieres generar nuevas páginas en demanda
  };
}

// Obtiene las props para la página (en este ejemplo, la información es fija)
export async function getStaticProps({ params }) {
  // Si necesitas obtener datos externos, lo puedes hacer aquí.
  // Por ejemplo, podrías consultar una API para obtener detalles de la comparación.
  return {
    props: {
      producto: params.producto,
    },
    // Si el contenido se actualiza ocasionalmente, puedes activar ISR:
    revalidate: 144000, // Regenera la página cada 3600 segundos (1 hora x 4)
  };
}