import React from 'react';
import Card from '../Card/Card';
import SkeletonCard from '../Card/SkeletonCard';

const Cards = ({ 
  products, 
  handleProductSelect, 
  isLoading 
}) => {

  // const products = [
  //   {
  //     cod_producto: "PROD001",
  //     n_producto: 1,
  //     marca: "Apple",
  //     categoria: "Laptops",
  //     nombre: "MacBook Pro",
  //     modelo: "M2 Max",
  //     n_serie: "SN123456789",
  //     titulo_de_producto: "MacBook Pro M2 Max 2024",
  //     descripcion: "Portátil de alto rendimiento con chip M2 Max, ideal para profesionales creativos.",
  //     n_electronica: "MBP2024",
  //     destacados: true,
  //     medidas: "30.41 x 21.24 x 1.55 cm",
  //     foto_1_1: "https://example.com/macbookpro1.jpg",
  //     foto_1_2: "https://example.com/macbookpro2.jpg",
  //     foto_1_3: "https://example.com/macbookpro3.jpg",
  //     foto_1_4: "https://example.com/macbookpro4.jpg",
  //   },
  //   {
  //     cod_producto: "PROD002",
  //     n_producto: 2,
  //     marca: "Dell",
  //     categoria: "Monitores",
  //     nombre: "Dell UltraSharp",
  //     modelo: "U3223QE",
  //     n_serie: "SN987654321",
  //     titulo_de_producto: "Dell UltraSharp 32 4K Monitor",
  //     descripcion: "Monitor 4K de 32 pulgadas con color preciso y múltiples opciones de conectividad.",
  //     n_electronica: "DELLMON3223",
  //     destacados: false,
  //     medidas: "71.2 x 23.1 x 52.9 cm",
  //     foto_1_1: "https://example.com/dellmonitor1.jpg",
  //     foto_1_2: "https://example.com/dellmonitor2.jpg",
  //     foto_1_3: "https://example.com/dellmonitor3.jpg",
  //     foto_1_4: "https://example.com/dellmonitor4.jpg",
  //   },
  //   {
  //     cod_producto: "PROD003",
  //     n_producto: 3,
  //     marca: "Logitech",
  //     categoria: "Periféricos",
  //     nombre: "Logitech MX Master 3",
  //     modelo: "MX Master 3",
  //     n_serie: "SN111222333",
  //     titulo_de_producto: "Ratón Inalámbrico Logitech MX Master 3",
  //     descripcion: "Ratón inalámbrico avanzado con desplazamiento electromagnético y ergonomía superior.",
  //     n_electronica: "LOGIMX3",
  //     destacados: true,
  //     medidas: "12.5 x 8.4 x 5.1 cm",
  //     foto_1_1: "https://example.com/logimouse1.jpg",
  //     foto_1_2: "https://example.com/logimouse2.jpg",
  //     foto_1_3: "https://example.com/logimouse3.jpg",
  //     foto_1_4: "https://example.com/logimouse4.jpg",
  //   },
  // ];

  return (
    <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-1">
      {isLoading ? (
        // Mostrar esqueletos cuando isLoading es true
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : products.length > 0 ? (
        // Mostrar las tarjetas de productos si hay productos
        products.map((product) => (
          <Card key={product._id} product={product} handleProductSelect={handleProductSelect} />
        ))
      ) : (
        // Mostrar mensaje de no hay productos encontrados si no hay productos
        <div className="flex flex-col justify-center items-center w-full mx-4 mt-6 px-20 py-10 border rounded-md shadow-lg bg-gray-200">
          <svg fill="#000000" className="w-10 h-10" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="m9 4.45-2 2-2-2-1 1 2 2-2 2 1 1 2-2 2 2 1-1-2-2 2-2zm2.77 6.63c.77-1.01 1.23-2.27 1.23-3.63 0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6c1.37 0 2.63-.46 3.64-1.24l2.79 2.79 1.13-1.13zm-4.87.76c-2.48 0-4.49-2.02-4.49-4.5s2.02-4.5 4.49-4.5 4.5 2.02 4.5 4.5-2.03 4.5-4.5 4.5z" />
          </svg>
          <span className="text-gray-800 font-semibold">No se encontraron productos que coincidan con tu búsqueda.</span>
        </div>
      )}
    </ul>
  );
};

export default Cards;
