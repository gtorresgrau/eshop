"use client"
import { useRef } from "react"
import Flicking, { ViewportSlot } from "@egjs/react-flicking"
import { Arrow } from "@egjs/flicking-plugins"
import "@egjs/react-flicking/dist/flicking.css"
import "@egjs/flicking-plugins/dist/arrow.css"
import useProducts from "@/hooks/useProducts"
import SkeletonDestacado from "../Tienda/Card/SkeletonDestacados"
import CardDestacado from "../Tienda/Card/CardDestacado"

const DemoComponent = () => {
  const flickingRef = useRef<Flicking>(null)
  const pluginsRef = useRef([new Arrow()])

  const { isModalOpen, closeModal, selectedProduct, handleProductSelect, allDestacados = [], isLoading } = useProducts()

  return (
    <section className="text-center max-w-7xl mx-auto" id="marcasDestacado">
      {isModalOpen && selectedProduct && <Modals closeModal={closeModal} selectedProduct={selectedProduct} />}
      {isLoading ? (
        <div className="flex gap-2 items-center justify-around">
          <div className="hidden md:flex">
                <SkeletonDestacado />
            </div>
            <div className="hidden md:flex">
                <SkeletonDestacado />
            </div>
            <div >
                <SkeletonDestacado />
            </div>
          </div>

      ) : allDestacados.length > 0 ? (
        <Flicking circular ref={flickingRef} plugins={pluginsRef.current} defaultIndex={Math.max(0, Math.floor(allDestacados.length / 3))}
          className="flex overflow-hidden whitespace-nowrap" >
          <ViewportSlot>
            <span className="flicking-arrow-prev rounded-full" />
            <span className="flicking-arrow-next" />
          </ViewportSlot>
          <div key={product.id} className="flicking-panel m-8 transition-transform transform hover:scale-105 w-64 p-6">
            <CardDestacado product={product} onSelect={handleProductSelect} />
          </div>
        </Flicking>
      ) : (
        <p className="text-center mt-4">No hay productos destacados en este momento.</p>
      )}
    </section>
  )
}

export default DemoComponent

