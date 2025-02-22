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
