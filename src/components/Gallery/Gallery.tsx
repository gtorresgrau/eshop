"use client"
import { useState } from "react";
import { Fade } from "react-awesome-reveal";

const images = [
  "/images/Gallery/1.webp",
  "/images/Gallery/2.webp",
  "/images/Gallery/4.webp",
  "/images/Gallery/7.webp",
  "/images/Gallery/6.webp",
  "/images/Gallery/10.webp",
  "/images/Gallery/5.webp"
];

const Gallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div id="fotos">
      <div className='mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8'>
        <div className="text-center items-center align-middle justify-center self-center place-items-center">
          <Fade direction={'up'} delay={400} cascade damping={1e-1} triggerOnce={true}>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center items-center place-items-center">
              <h2 className='text-pink font-normal tracking-widest italic font-serif ls-51 mb-4 text-3xl md:text-4xl text-center text-tertiary'>Galeria</h2>
              <div className="px-10 pt-1 mb-2 text-center place-items-center bg-tertiary uppercase w-1/4"></div>
            </div>
          </Fade>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-12 mt-16 mb-6 sm:space-x-6 space-y-6 md:space-y-0 px-6'>
          <div className='col-span-6 flex justify-center overflow-hidden rounded-3xl cursor-pointer' onClick={() => openModal(0)}>
            <img src={images[0]} alt="Galería" loading="lazy" width={1000} height={805} className="inner-img" />
          </div>
          <div className='col-span-6 flex justify-center'>
            <div className="grid grid-rows-1 grid-flow-row gap-4">
              <div className="row-span-1 overflow-hidden rounded-3xl cursor-pointer" onClick={() => openModal(1)}>
                <img src={images[1]} alt="Galería" loading="lazy" width={700} height={405} className="inner-img" />
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <div className='overflow-hidden rounded-3xl cursor-pointer' onClick={() => openModal(2)}>
                  <img src={images[2]} alt="Galería" loading="lazy" width={500} height={405} className="inner-img" />
                </div>
                <div className='overflow-hidden rounded-3xl cursor-pointer' onClick={() => openModal(3)}>
                  <img src={images[3]} alt="Galería" loading="lazy" width={500} height={405} className="inner-img" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='hidden md:grid grid-cols-1 md:grid-cols-12 mb-16 sm:space-x-6 space-y-6 md:space-y-0 px-6'>
          <div className='col-span-6 flex justify-center'>
            <div className="grid grid-rows-1 grid-flow-row gap-4">
              <div className='grid grid-cols-2 gap-2'>
                <div className='overflow-hidden rounded-3xl cursor-pointer' onClick={() => openModal(4)}>
                  <img src={images[4]} alt="Galería" loading="lazy" width={500} height={405} className="inner-img" />
                </div>
                <div className='overflow-hidden rounded-3xl cursor-pointer' onClick={() => openModal(5)}>
                  <img src={images[5]} alt="Galería" loading="lazy" width={500} height={405} className="inner-img" />
                </div>
              </div>
              <div className="row-span-1 overflow-hidden rounded-3xl cursor-pointer" onClick={() => openModal(2)}>
                <img src={images[2]} alt="Galería" loading="lazy" width={700} height={405} className="inner-img" />
              </div>
            </div>
          </div>
          <div className='col-span-6 flex justify-center overflow-hidden rounded-3xl cursor-pointer' onClick={() => openModal(6)}>
            <img src={images[6]} alt="Galería" loading="lazy" width={1000} height={705} className="inner-img" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <button
            className="absolute top-5 right-6 text-white text-4xl font-bold hover:text-tertiary transition-colors"
            onClick={closeModal}
            aria-label="Cerrar galería"
          >
            &times;
          </button>

          <div className="relative max-w-3xl w-full px-4 flex flex-col items-center">
            <div key={currentIndex} className="transition-transform duration-500 ease-in-out transform opacity-100">
              <img
                src={images[currentIndex]}
                alt={`Galería ${currentIndex + 1}`}
                className="rounded-xl max-h-[80vh] object-contain"
              />
            </div>

            <div className="flex w-full mt-4 text-white text-xl font-bold justify-center gap-2">
              <button onClick={prevSlide} className="hover:text-secondary px-3 transition-colors bg-slate-800 rounded-full">
                &larr;
              </button>
              <button onClick={nextSlide} className="hover:text-secondary px-3 py-1 transition-colors bg-slate-800 rounded-full"  >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
