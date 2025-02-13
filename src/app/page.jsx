
import React, { Suspense } from "react";
import Banner from "@/components/Banner/Banner";
import BotonWsp from "@/components/BotonWSP/BotonWsp";
import Destacados from "@/components/Destacados/Destacados";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import Sobre from "@/components/SobreMi/Sobre";
import Ubicacion from "@/components/Ubicacion/Ubicacion";
import NavBar from "@/components/NavBar/NavBar";
import Tienda from "@/components/Tienda/Tienda";
import VolverArriba from "@/components/VolverArriba/VolverArriba";
import Loading from "@/components/Loading/Loading";
import SearchBase from "@/components/Search/SearchBase";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentas/PreguntasFrecuentas";
import Comparativas from "@/components/Comparativas/Comparativas";
import CleanToolExplanation from "@/components/Tools/CleanToolExplanation";

export default function Home() {

  return (
    <>
      <nav>
        <Suspense fallback={<Loading/>}>
          <NavBar  />
        </Suspense>
      </nav>
      <main>
        <Suspense fallback={<Loading/>}>
          <SearchBase />
        </Suspense>
          <Banner />
        <Suspense fallback={<Loading/>}>
          {/* <UnderConstruction /> */}
          <Destacados />
          <Tienda />
          <Comparativas />
          <CleanToolExplanation />
        </Suspense>
          {/* <Carrusel /> */}
          <Sobre/>
          <Ubicacion/>
          <PreguntasFrecuentes />
          <Contact />
      </main>
      <footer>
        <Footer />
        <VolverArriba />
        <BotonWsp />
      </footer>
    </>
  );
}
