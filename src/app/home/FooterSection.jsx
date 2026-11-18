"use client";

import React from "react";
import dynamic from "next/dynamic";
import Footer from "../../components/Footer/Footer"; // import estático: los links del footer salen en el HTML para el crawler

const VolverArriba = dynamic(() => import("../../components/VolverArriba/VolverArriba"), { ssr: false });
const BotonWsp = dynamic(() => import("../../components/BotonWSP/BotonWsp"), { ssr: false });


export default function FooterSection() {
  return (
    <footer className="flex flex-col">
      <Footer />
      <VolverArriba />
      <BotonWsp />
    </footer>
  );
}
