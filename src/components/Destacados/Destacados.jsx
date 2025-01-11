'use client'
import React, { useRef, Suspense } from "react";
import Flicking, { ViewportSlot } from "@egjs/react-flicking";
import { Arrow } from "@egjs/flicking-plugins";
import "@egjs/react-flicking/dist/flicking.css";
import "@egjs/flicking-plugins/dist/arrow.css";
import useProducts from "@/Hooks/useProducts";
import SkeletonDestacado from "../Tienda/Card/SkeletonDestacados";
import CardDestacado from "../Tienda/Card/CardDestacado";
import Modals from "../Tienda/Modal/Modals";
import Loading from "../Loading/Loading";

const DemoComponent = () => {
  const flickingRef = useRef(null);
  const pluginsRef = useRef([new Arrow()]);

  const {
    isModalOpen,
    closeModal,
    selectedProduct,
    handleProductSelect,
    allDestacados,
    isLoading,
  } = useProducts();

  // Generar contenido del slider
  const renderSliderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flicking-panel m-8 transition-transform transform hover:scale-105 w-64 p-6" >
          <SkeletonDestacado />
        </div>
      ));
    }

    if (allDestacados.length === 0) return null;

    return allDestacados.map((item, i) => (
      <div key={i} className="flicking-panel m-8 transition-transform transform hover:scale-105 w-64 p-6">
        <CardDestacado selectedProduct={item} handleProductSelect={handleProductSelect} />
      </div>
    ));
  };

  return (
    <Suspense fallback={<Loading />}>
      <section className="text-center max-w-7xl mx-auto" id="marcasDestacado">
        {isModalOpen && selectedProduct && (
          <Modals closeModal={closeModal} selectedProduct={selectedProduct} />
        )}
        {allDestacados.length > 0 && (
          <Flicking circular ref={flickingRef} plugins={pluginsRef.current} defaultIndex={Math.floor(allDestacados.length / 3)} className="flex overflow-hidden whitespace-nowrap">
            <ViewportSlot>
              <span className="flicking-arrow-prev rounded-full"></span>
              <span className="flicking-arrow-next"></span>
            </ViewportSlot>
            {renderSliderContent()}
          </Flicking>
        )}
      </section>
    </Suspense>
  );
};

export default DemoComponent;
