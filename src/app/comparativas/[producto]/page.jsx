import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";

const HeaderSection = dynamic(()=>import ( "@/app/home/HeaderSection"))
const FooterSection = dynamic(()=>import ( "@/app/home/FooterSection"))
const Loading = dynamic(()=>import ( "@/components/Loading/Loading"))

// Mapeo de los componentes según el producto
const comparisonComponents = {
  almacenamiento: dynamic(() => import("@/components/Comparativas/Almacenamiento/AlmacenamientoPage"), { ssr: false }),
  memoria: dynamic(() => import("@/components/Comparativas/MemoriaRam/MemoriaRamPage"), { ssr: false }),
  fuente: dynamic(() => import("@/components/Comparativas/Fuentes/FuentePage"), { ssr: false }),
};

const ComparativaPage = ({ params }) => {
  const { producto } = params;

  // Si el producto no existe en el mapeo, devuelve un 404
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
export async function generateStaticParams() {
  return [
    { producto: "almacenamiento" },
    { producto: "memoria" },
    { producto: "fuente" },
  ];
}

// Configura la revalidación (ISR) en segundos (en este caso, 14400 segundos = 4 horas)
export const revalidate = 14400;