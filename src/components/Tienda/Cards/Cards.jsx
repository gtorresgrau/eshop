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
  //     cod_producto: "P001",
  //     n_producto: 1,
  //     marca: "Zeiss",
  //     categoria: "Lentes",
  //     nombre: "Lente Intraocular",
  //     modelo: "AcrySof IQ",
  //     n_serie: "12345ABC",
  //     titulo_de_producto: "Lente Intraocular Premium",
  //     descripcion: "Lente intraocular monofocal con filtro de luz azul.",
  //     n_electronica: "ELEC-001",
  //     precio: "1500",
  //     destacados: true,
  //     usd: true,
  //     usado: false,
  //     vendiod:false,
  //     medidas: "12mm x 6mm",
  //     foto_1_1: "url1.jpg",
  //     foto_1_2: "url2.jpg",
  //     foto_1_3: "url3.jpg",
  //     foto_1_4: "url4.jpg"
  //   },
  //   {
  //     cod_producto: "P002",
  //     n_producto: 2,
  //     marca: "Topcon",
  //     categoria: "Equipamiento",
  //     nombre: "Autorefractómetro",
  //     modelo: "KR-800",
  //     n_serie: "67890XYZ",
  //     titulo_de_producto: "Autorefractómetro de Alta Precisión",
  //     descripcion: "Dispositivo para medir la refracción ocular con precisión avanzada.",
  //     n_electronica: "ELEC-002",
  //     precio: "8500",
  //     destacados: false,
  //     usd: true,
  //     usado: true,
  //     vendiod:true,
  //     medidas: "40cm x 30cm x 50cm",
  //     foto_1_1: "url5.jpg",
  //     foto_1_2: "url6.jpg",
  //     foto_1_3: "url7.jpg",
  //     foto_1_4: "url8.jpg"
  //   },
  //   {
  //     cod_producto: "P003",
  //     n_producto: 3,
  //     marca: "Heine",
  //     categoria: "Instrumentos",
  //     nombre: "Oftalmoscopio",
  //     modelo: "Beta 200",
  //     n_serie: "11223LMN",
  //     titulo_de_producto: "Oftalmoscopio de Diagnóstico",
  //     descripcion: "Instrumento de diagnóstico con iluminación LED y ajuste de enfoque.",
  //     n_electronica: "ELEC-003",
  //     precio: "1200",
  //     destacados: true,
  //     usd: false,
  //     usado: false,
  //     vendiod:false,
  //     medidas: "18cm x 5cm",
  //     foto_1_1: "url9.jpg",
  //     foto_1_2: "url10.jpg",
  //     foto_1_3: "url11.jpg",
  //     foto_1_4: "url12.jpg"
  //   }
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
