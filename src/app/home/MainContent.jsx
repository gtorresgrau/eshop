'use client'; 
import React, { Suspense } from 'react';
import Banner from '../../components/Banner/Banner';
import BotonWsp from '../../components/BotonWSP/BotonWsp';
import Contact from '../../components/Contact/Contact';
import Sobre from '../../components/SobreMi/Sobre';
import Tienda from '../../components/Tienda/Tienda';
import Loading from '../../components/Loading/Loading';
import SearchBase from '../../components/Search/SearchBase';
import PreguntasFrecuentes from '../../components/PreguntasFrecuentas/PreguntasFrecuentas';
import Comparativas from '../../components/Comparativas/Comparativas';
import CleanToolExplanation from '../../components/Tools/CleanToolExplanation';

export default function MainContent() {
  return (
    <main>
      {/* Top part */}
      <Suspense fallback={<Loading />}>
        <SearchBase />
      </Suspense>

      <Banner />

      {/* Middle part */}
      <Suspense fallback={<Loading />}>
        {/* Add or remove whichever components you want lazy-loaded */}
        <Tienda />
        <Comparativas />
        <CleanToolExplanation />
      </Suspense>

      {/* Additional content */}
      <Sobre />
      <PreguntasFrecuentes />
      <Contact />

      {/* Example: If you want the WhatsApp button in main */}
      <BotonWsp />
    </main>
  );
}
