"use client"

import { useRef } from "react"
import Flicking, { ViewportSlot } from "@egjs/react-flicking"
import { Arrow } from "@egjs/flicking-plugins"
import "@egjs/react-flicking/dist/flicking.css"
import "@egjs/flicking-plugins/dist/arrow.css"
import useProducts from "@/hooks/useProducts"
import SkeletonDestacado from "../tienda/card/SkeletonDestacados"
import CardDestacado from "../tienda/card/CardDestacado"
import Modals from "../tienda/modal/Modals"
import Loading from "../loading/Loading"

const DemoComponent = () => {
  const flickingRef = useRef<Flicking>(null)
  const pluginsRef = useRef([new Arrow()])

  const { isModalOpen, closeModal, selectedProduct, handleProductSelect, allDestacados = [], isLoading } = useProducts()

  const renderSliderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flicking-panel m-8 transition-transform transform hover:scale-105 w-64 p-6">
          <SkeletonDestacado />
        </div>
      ))
    }

    return allDestacados.map((product) => (
      <div key={product.id} className="flicking-panel m-8 transition-transform transform hover:scale-105 w-64 p-6">
        <CardDestacado product={product} onSelect={handleProductSelect} />
      </div>
    ))
  }

  return (
    <section className="text-center max-w-7xl mx-auto" id="marcasDestacado">
      {isModalOpen && selectedProduct && <Modals closeModal={closeModal} selectedProduct={selectedProduct} />}
      {isLoading ? (
        <Loading />
      ) : allDestacados.length > 0 ? (
        <Flicking
          circular
          ref={flickingRef}
          plugins={pluginsRef.current}
          defaultIndex={Math.max(0, Math.floor(allDestacados.length / 3))}
          className="flex overflow-hidden whitespace-nowrap"
        >
          <ViewportSlot>
            <span className="flicking-arrow-prev rounded-full" />
            <span className="flicking-arrow-next" />
          </ViewportSlot>
          {renderSliderContent()}
        </Flicking>
      ) : (
        <p className="text-center mt-4">No hay productos destacados en este momento.</p>
      )}
    </section>
  )
}

export default DemoComponent

