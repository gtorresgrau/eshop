'use client'
import React from 'react';
import Banner from '../../components/Banner/Banner';
import BotonWsp from '../../components/BotonWSP/BotonWsp';
import Contact from '../../components/Contact/Contact';
import Sobre from '../../components/SobreMi/Sobre';
import SearchBase from '../../components/Search/SearchBase';
import PreguntasFrecuentes from '../../components/PreguntasFrecuentas/PreguntasFrecuentas';
import Comparativas from '../../components/Comparativas/Comparativas';
import CleanToolExplanation from '../../components/Tools/CleanToolExplanation';
import Productos from '@/components/Tienda/Productos';
import Header from '@/components/Banner/Header';

export default function MainContent() {

  return (
    <main>
      {/* Top part */}
      <Banner />
      <Header />
      <SearchBase />
      
      {/* Middle part */}
      <Productos />
      <Comparativas />
      <CleanToolExplanation />

      {/* Additional content */}
      <Sobre />
      <PreguntasFrecuentes />
      <Contact />

      {/* Example: If you want the WhatsApp button in main */}
      <BotonWsp />
    </main>
  );
}
