'use client';
import { useFavoritos } from '../Context/FavoritosContext';

/**
 * Corazón para guardar/quitar un producto de favoritos. `className` define posición y tamaño del botón.
 * Lleno y naranja cuando está guardado; contorno cuando no.
 */
export default function BotonFavorito({ product, className = '' }) {
  const { esFavorito, alternar } = useFavoritos();
  const activo = esFavorito(product?.cod_producto);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); alternar(product); }}
      aria-pressed={activo}
      aria-label={activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      title={activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`inline-flex items-center justify-center bg-white text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 ${className}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
        fill={activo ? '#C2410C' : 'none'} stroke={activo ? '#C2410C' : 'currentColor'} strokeWidth="2" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
