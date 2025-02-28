"use client";

import React from "react";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer/Footer"));
const VolverArriba = dynamic(() => import("@/components/VolverArriba/VolverArriba"), { ssr: false });

export default function FooterSection() {
  return (
    <footer className="flex flex-col">
      <Footer />
      <VolverArriba />
    </footer>
  );
}
