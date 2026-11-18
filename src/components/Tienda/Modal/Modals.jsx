'use client'
import { useCallback, useContext, useEffect, useState } from 'react';
import { CartContext } from '../../../components/Context/ShoopingCartContext';
import addToCart from '../../../Utils/addToCart';
import ProductoDetalle from './ProductoDetalle';
import handleShare from '../../../Utils/handleShare';

const Modal = ({ selectedProduct, closeModal, isDialog = true }) => {
  const [cart, setCart] = useContext(CartContext);
  const [mainImage, setMainImage] = useState(selectedProduct.foto_1_1);

  const thumbnails = [
    { src: selectedProduct.foto_1_1, alt: `${selectedProduct.nombre} - miniatura 1` },
    { src: selectedProduct.foto_1_2, alt: `${selectedProduct.nombre} - miniatura 2` },
    { src: selectedProduct.foto_1_3, alt: `${selectedProduct.nombre} - miniatura 3` },
    { src: selectedProduct.foto_1_4, alt: `${selectedProduct.nombre} - miniatura 4` },
  ].filter((img) => img.src);

  const handleThumbnailClick = (image) => setMainImage(image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(selectedProduct, cart, setCart);
  };

  const handleClose = useCallback(() => { if (closeModal) closeModal(); }, [closeModal]);

  // Escape cierra el modal (solo cuando es un diálogo)
  useEffect(() => {
    if (!isDialog) return undefined;
    const onKey = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDialog, handleClose]);

  const detalle = (
    <ProductoDetalle
      selectedProduct={selectedProduct}
      mainImage={mainImage}
      handleThumbnailClick={handleThumbnailClick}
      thumbnails={thumbnails}
      handleShare={(e) => handleShare(e, selectedProduct)}
      handleAddToCart={handleAddToCart}
    />
  );

  if (!isDialog) {
    return <div className="mx-auto w-full max-w-screen-xl px-4 py-8 lg:px-8">{detalle}</div>;
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/60 lg:items-center lg:p-6"
      onClick={handleClose}
    >
      <div className="relative max-h-full w-full max-w-6xl overflow-y-auto bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-20 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="m-3 inline-flex h-11 w-11 items-center justify-center bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700"
            aria-label="Cerrar la ventana"
            title="Cerrar (Esc)"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" aria-hidden="true">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
        <div className="-mt-14 px-5 pb-8 pt-16 lg:px-10 lg:pb-10">{detalle}</div>
      </div>
    </section>
  );
};

export default Modal;
