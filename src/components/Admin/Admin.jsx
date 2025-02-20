'use client'
import React, { Suspense, useState } from "react";
import AddProduct from "./AddProduct/AddProduct";
import useProducts from "@/Hooks/useProducts";
import Dropdown from "../Tienda/Dropdown/Dropdown";
import Nav from "./Nav/Nav";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";
import SearchBase from "../Search/SearchBase";
import ProductTable from "./ProductTable"; // Extraemos la tabla a un componente separado

export default function Admin() {
  const [section, setSection] = useState("Productos");

  const {
    products,
    categories,
    brands,
    selectedCategories,
    selectedBrands,
    showAllCategories,
    showAllBrands,
    isLoading,
    handleCheckboxChange,
    handleClearFilters,
    handleShowAllCategories,
    handleShowAllBrands,
    fetchProducts,
    openModal,
    closeModal,
    selectedProduct,
    isModalOpen,
  } = useProducts();

  const handleEliminarArchivos = async (producto) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este producto ni sus imágenes asociadas.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Eliminando producto...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const fotosAEliminar = Object.keys(producto)
        .filter((key) => key.startsWith("foto_") && producto[key])
        .map((key) => `Products/${producto[key].split("/").pop().split(".")[0]}`);

      await Promise.all(
        fotosAEliminar.map(async (imgAEliminar) => {
          await fetch("api/deleteImage", {
            method: "DELETE",
            body: JSON.stringify({ file: imgAEliminar }),
          });
        })
      );

      const resBDD = await fetch("api/deleteProduct", {
        method: "DELETE",
        body: JSON.stringify({ id: producto._id }),
      });
      const dataBDD = await resBDD.json();

      if (dataBDD.success) {
        fetchProducts();
        Swal.fire({
          icon: "success",
          title: "El producto ha sido eliminado correctamente.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error(dataBDD.error);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Swal.fire("Error", "Ha ocurrido un error al intentar eliminar el producto.", "error");
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col min-h-screen">
        <Nav handleSelectSection={setSection} />
        {section === "Productos" && (
          <div>
            <section id="tablaProductosAdmin" className="bg-primary-background p-2 sm:p-3 md:p-5">
              <div className="mx-auto max-w-screen-xl px-0 lg:px-12">
                <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                      <SearchBase />
                    </div>
                    <div className="md:flex md:justify-end gap-3 grid grid-cols-5 w-full">
                      <div className="col-span-2">
                        <Dropdown
                          handleClearFilters={handleClearFilters}
                          handleCheckboxChange={handleCheckboxChange}
                          categories={categories}
                          showAllCategories={showAllCategories}
                          selectedCategories={selectedCategories}
                          handleShowAllCategories={handleShowAllCategories}
                          brands={brands}
                          showAllBrands={showAllBrands}
                          selectedBrands={selectedBrands}
                          handleShowAllBrands={handleShowAllBrands}
                          isLoading={isLoading}
                        />
                      </div>
                      <div className="col-span-3">
                        <button
                          type="button"
                          aria-label="agregar producto"
                          className="flex items-center text-white border bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active font-medium w-full justify-center rounded-lg h-10 text-xs xs:text-sm px-5 py-2"
                          onClick={() => openModal(null, "#add")}
                        >
                          + Agregar producto
                        </button>
                        {isModalOpen && !selectedProduct && (
                          <AddProduct toggleModal={closeModal} isOpenModal={isModalOpen} marca={brands} categoria={categories} />
                        )}
                      </div>
                    </div>
                  </div>
                  <ProductTable products={products} handleEliminarArchivos={handleEliminarArchivos} />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </Suspense>
  );
}
