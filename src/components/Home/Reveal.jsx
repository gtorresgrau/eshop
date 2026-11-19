'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Entrada de una parte de la página: sube 24px y aparece cuando entra en pantalla, una sola vez.
 * El contenido es visible desde el principio (también sin JavaScript): solo se oculta lo que está
 * por debajo de la pantalla al cargar, y no se anima con "reducir movimiento".
 * `delay` escalona las partes de una sección (60–90 ms entre cada una).
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [estado, setEstado] = useState('visible'); // visible | oculto | entrando

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return undefined; // ya está a la vista
    setEstado('oculto');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEstado('entrando');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={estado === 'entrando' ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${className} transition-[opacity,transform] duration-700 ease-out ${
        estado === 'oculto' ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      {children}
    </Tag>
  );
}
