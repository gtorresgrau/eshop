import React from 'react';

/** Esquema de carga con la misma estructura que Card: campo liso para la foto, líneas de texto y dos botones. */
export default function SkeletonCard() {
  return (
    <div className="w-full list-none animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div className="aspect-square bg-gray-100" />
      <div className="mt-3 h-4 w-1/3 bg-gray-100" />
      <div className="mt-2 h-5 w-5/6 bg-gray-100" />
      <div className="mt-1 h-5 w-2/3 bg-gray-100" />
      <div className="mt-4 h-6 w-1/2 bg-gray-100" />
      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="h-11 bg-gray-100" />
        <div className="h-11 bg-gray-100" />
      </div>
    </div>
  );
}
