'use client';
import { useState, useEffect } from 'react';

/**
 * Botón "Volver arriba": aparece pasados 500px de scroll, a la izquierda del botón de WhatsApp
 * (así el menú de contactos, que se abre hacia arriba, no lo tapa). Cuadrado, fondo liso, sin sombra.
 */
const VolverArriba = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500); // React ignora el set si no cambia
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const subir = () => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={subir}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-[31px] right-[98px] z-40 inline-flex h-12 w-12 items-center justify-center bg-gray-900 text-white transition-[opacity,background-color] duration-200 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 motion-reduce:transition-none ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default VolverArriba;
