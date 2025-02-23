import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import BotonWsp from "@/components/BotonWSP/BotonWsp";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading/Loading";
import NavBar from "@/components/NavBar/NavBar";
import VolverArriba from "@/components/VolverArriba/VolverArriba";

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
      <nav>
        <Suspense fallback={<Loading />}>
          <NavBar />
        </Suspense>
      </nav>
      <main className="flex-1 flex items-center justify-center bg-white">
        <Suspense fallback={<Loading />}>
          <SelectedComponent />
        </Suspense>
      </main>
      <footer className="bg-gray-200">
        <Footer />
        <VolverArriba />
        <BotonWsp />
      </footer>
    </div>
  );
};

export default ComparativaPage;
