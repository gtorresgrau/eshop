"use client"
import React, { useEffect, useRef, useState } from 'react';
import ProductForm from '../ProductForm/ProductForm';
import Swal from 'sweetalert2';
import { removeFromLocalStorage } from '../../../Hooks/localStorage';

export default function AddProduct({ isOpenModal, toggleModal, categoria, marca }) {
  const [marcas, setMarcas] = useState(marca || []);
  const [categorias, setCategorias] = useState(categoria || []);

  const [originalImages] = useState({
    foto_1_1: '',
    foto_1_2: '',
    foto_1_3: '',
    foto_1_4: '',
  });

  const [producto, setProducto] = useState({
    marca: '',
    categoria: '',
    nombre: '',
    modelo: '',
    n_serie: '',
    titulo_de_producto: '',
    descripcion: '',
    n_electronica: '',
    precio: '',
    medidas: '',
    foto_1_1: '',
    foto_1_2: '',
    foto_1_3: '',
    foto_1_4: '',
    hide: false,
    stock: false,
    vendido: false,
    destacados: false,
    usd: false,
    usado: false,
  });

  const marcaDropdownRef = useRef(null);
  const categoriaDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (marcaDropdownRef.current && !marcaDropdownRef.current.contains(event.target)) return;
      if (categoriaDropdownRef.current && !categoriaDropdownRef.current.contains(event.target)) return;
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAgregarNuevaMarca = (_, valorNuevo) => {
    if (!valorNuevo) return;
    setMarcas((m) => [...m, valorNuevo]);
  };

  const handleAgregarNuevaCategoria = (_, valorNuevo) => {
    if (!valorNuevo) return;
    setCategorias((c) => [...c, valorNuevo]);
  };

  const handleUpdateImages = (newImages) => {
    setProducto((prev) => ({
      ...prev,
      foto_1_1: newImages[0]?.preview || '',
      foto_1_2: newImages[1]?.preview || '',
      foto_1_3: newImages[2]?.preview || '',
      foto_1_4: newImages[3]?.preview || '',
    }));
  };

  const handleRemoveImage = (index) => {
    setProducto((prev) => {
      const copy = { ...prev };
      if (index === 0) copy.foto_1_1 = '';
      if (index === 1) copy.foto_1_2 = '';
      if (index === 2) copy.foto_1_3 = '';
      if (index === 3) copy.foto_1_4 = '';
      return copy;
    });
  };

  const hasImageChanges = () => {
    return (
      producto.foto_1_1 !== originalImages.foto_1_1 ||
      producto.foto_1_2 !== originalImages.foto_1_2 ||
      producto.foto_1_3 !== originalImages.foto_1_3 ||
      producto.foto_1_4 !== originalImages.foto_1_4
    );
  };

  const handleToggleModal = () => {
    if (hasImageChanges()) {
      Swal.fire({ icon: 'warning', title: 'Debe guardar los cambios antes de cerrar.', showCancelButton: false });
    } else {
      toggleModal();
    }
  };

  const handleChangeInput = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value, titulo_de_producto: `${(prev.nombre || '')} ${(prev.marca || '')}`.trim() }));
  };

  const submitAddProduct = async (e) => {
    e.preventDefault();
    if (!producto.nombre || !producto.nombre.trim()) {
      alert('Por favor ingrese un nombre para el producto.');
      return;
    }

    const filteredProducto = Object.fromEntries(Object.entries(producto).filter(([_, v]) => v !== undefined && v !== null && v !== ''));

    const formData = new FormData();
    for (const [k, v] of Object.entries(filteredProducto)) formData.append(k, v);

    try {
      Swal.fire({ title: 'Agregando producto...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
      const res = await fetch('api/addProduct', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      Swal.fire({ icon: 'success', title: 'Producto agregado', showConfirmButton: false, timer: 1500 });
      removeFromLocalStorage('productos');
      toggleModal();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al agregar producto', text: 'Por favor, inténtelo de nuevo más tarde.' });
      toggleModal();
      console.error(err);
    }
  };

  const imagenes = [producto.foto_1_1, producto.foto_1_2, producto.foto_1_3, producto.foto_1_4].filter(Boolean);

  return (
    <div>
      <div id="updateProductModal" tabIndex="-1" aria-label="updateProductModal" className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 overflow-hidden ${isOpenModal ? '' : 'hidden'}`}>
        <div className="rounded-none max-w-3xl w-full max-h-full overflow-y-auto">
          <div className="relative p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Producto</h3>
              <button aria-label="Agregar producto" type="button" onClick={handleToggleModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="updateProductModal">
                <svg aria-label="Agregar producto" className="w-5 h-5" width={20} height={20} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>

            <ProductForm producto={producto} onChange={handleChangeInput} imagenes={imagenes} updateImages={handleUpdateImages} removeImage={handleRemoveImage} onSubmit={submitAddProduct} submitLabel="Agregar producto" marcas={marcas} categorias={categorias} onAddMarca={handleAgregarNuevaMarca} onAddCategoria={handleAgregarNuevaCategoria} onClose={handleToggleModal} />
          </div>
        </div>
      </div>
    </div>
  );
}
  