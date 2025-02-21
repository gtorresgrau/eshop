import React from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { Pagination } from "@mui/material";
import useProducts from "@/Hooks/useProducts";

const UpdateProduct = dynamic(() => import('./UpdateProduct/UpdateProduct'));

const ProductTable = ({ products, handleEliminarArchivos }) => {
    const {
        categories,
        brands,
        openModal,
        closeModal,
        selectedProduct,
        isModalOpen,
        totalPages,
        currentPage,
        handlePageChange
      } = useProducts();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">Imagen</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Marca</th>
            <th scope="col" className="px-4 py-3">Categoría</th>
            <th scope="col" className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((producto) => (
              <tr key={producto._id} className="bg-white border-b">
                <td className="px-4 py-3">
                  {producto.foto_1 ? (
                    <Image
                      src={producto.foto_1}
                      alt={producto.nombre}
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-3">{producto.nombre}</td>
                <td className="px-4 py-3">{producto.marca || "N/A"}</td>
                <td className="px-4 py-3">{producto.categoria || "N/A"}</td>
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => openModal(producto, "#update")}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEliminarArchivos(producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={closeModal}
          marca={brands}
          categoria={categories}
        />
      )}
      {products.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination 
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                className="flex justify-center my-6 bg-white" />
        </div>
      )}
    </div>
  );
};

export default ProductTable;
