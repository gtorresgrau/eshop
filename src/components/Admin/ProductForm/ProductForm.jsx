"use client"
import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import UploadImage from '../UploadImage';

export default function ProductForm({
  producto,
  onChange,
  imagenes,
  updateImages,
  removeImage,
  onSubmit,
  submitLabel = 'Guardar cambios',
  marcas = [],
  categorias = [],
  onAddMarca = () => {},
  onAddCategoria = () => {},
  onClose = () => {},
}) {
  const [isDropdownMarcaOpen, setIsDropdownMarcaOpen] = useState(false);
  const [isDropdownCategoriaOpen, setIsDropdownCategoriaOpen] = useState(false);
  const [marcaNueva, setMarcaNueva] = useState('');
  const [categoriaNueva, setCategoriaNueva] = useState('');

  const marcaDropdownRef = useRef(null);
  const categoriaDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (marcaDropdownRef.current && !marcaDropdownRef.current.contains(event.target)) {
        setIsDropdownMarcaOpen(false);
      }
      if (categoriaDropdownRef.current && !categoriaDropdownRef.current.contains(event.target)) {
        setIsDropdownCategoriaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMarca = (e) => {
    e?.preventDefault();
    setIsDropdownMarcaOpen((s) => !s);
  };

  const toggleCategoria = (e) => {
    e?.preventDefault();
    setIsDropdownCategoriaOpen((s) => !s);
  };

  const handleAddMarca = () => {
    if (!marcaNueva) return;
    onAddMarca('marca', marcaNueva);
    setMarcaNueva('');
    setIsDropdownMarcaOpen(false);
  };

  const handleAddCategoria = () => {
    if (!categoriaNueva) return;
    onAddCategoria('categoria', categoriaNueva);
    setCategoriaNueva('');
    setIsDropdownCategoriaOpen(false);
  };

  return (
    <form onSubmit={onSubmit} id="productForm">
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">Nombre<span className='text-xs text-red-500'>*</span></label>
          <div className="flex">
            <input
              onChange={onChange}
              type="text"
              name="nombre"
              id="nombre"
              value={producto.nombre || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Nombre del producto"
            />
            {producto.destacados ? (
              <Image src="/images/FotoDestacados.webp" alt={producto.nombre} width={30} height={20} className="m-1" loading="lazy" title={producto.nombre} />
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-900">Marca<span className='text-red-500'>*</span></label>
          <div className="flex gap-4">
            <select onChange={onChange} name="marca" id="marca" value={producto.marca || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
              <option value="" hidden>Seleccione una marca</option>
              {marcas.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>

            <div className="relative" ref={marcaDropdownRef}>
              <button aria-label="seleccionar marca" className="text-gray-800 bg-gray-50 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm inline-flex items-center w-auto h-full p-3" onClick={toggleMarca} tabIndex={0}><FaPlus /></button>
              {isDropdownMarcaOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                  <div className="block w-full px-2 py-2 text-left text-gray-700">
                    <input type="text" name="marcaNueva" id="marcaNueva" value={marcaNueva} onChange={(e) => setMarcaNueva(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-1" placeholder="Ingrese una marca nueva" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMarca(); } }} />
                    <button aria-label="agregar nueva marca" onClick={handleAddMarca} className="w-full rounded-lg m-auto px-4 py-2 text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-500 focus:outline-none focus:ring-4">AGREGAR</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900">Categoría<span className='text-red-500'>*</span></label>
          <div className="flex gap-4">
            <select onChange={onChange} name="categoria" id="categoria" value={producto.categoria || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
              <option value="" hidden>Seleccione una categoria</option>
              {categorias.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            <div className="relative" ref={categoriaDropdownRef}>
              <button aria-label="seleccionar categoria" className="text-gray-800 bg-gray-50 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm inline-flex items-center w-auto h-full p-3" onClick={toggleCategoria} tabIndex={0}><FaPlus /></button>
              {isDropdownCategoriaOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                  <div className="block w-full px-2 py-2 text-left text-gray-700">
                    <input type="text" name="categoriaNueva" id="categoriaNueva" value={categoriaNueva} onChange={(e) => setCategoriaNueva(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-1" placeholder="Ingrese una categoría" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategoria(); } }} />
                    <button aria-label="agregar nueva categoria" onClick={handleAddCategoria} className="w-full rounded-lg m-auto px-4 py-2 text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-500 focus:outline-none focus:ring-4">AGREGAR</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-900">Modelo<span className='text-xs text-red-500'>*</span></label>
          <input onChange={onChange} type="text" name="modelo" id="modelo" value={producto.modelo || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Modelo del producto" />
        </div>

        <div>
          <label htmlFor="n_serie" className="block mb-2 text-sm font-medium text-gray-900">Numero de serie</label>
          <input onChange={onChange} type="text" name="n_serie" id="n_serie" value={producto.n_serie || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Numero de serie del producto" />
        </div>

        <div>
          <label htmlFor="n_electronica" className="block mb-2 text-sm font-medium text-gray-900">Numero de electronica</label>
          <input onChange={onChange} type="text" name="n_electronica" id="n_electronica" value={producto.n_electronica || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Numero de electronica del producto" />
        </div>

        <div>
          <label htmlFor="medidas" className="block mb-2 text-sm font-medium text-gray-900">Medidas</label>
          <input onChange={onChange} type="text" name="medidas" id="medidas" value={producto.medidas || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Medidas del producto" />
        </div>

        <div>
          <label htmlFor="precio" className="block mb-2 text-sm font-medium text-gray-900">Precio<span className='text-xs text-red-500'>*</span></label>
          <input onChange={onChange} type="text" name="precio" id="precio" value={producto.precio || ''} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="$100.000" />
          <div className='flex gap-2 mb-2'>
            <input onChange={onChange} type="checkbox" name="usd" id="usd" checked={!!producto.usd} />
            <label htmlFor="usd" className="block text-sm font-medium text-gray-900">usd?</label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900">Descripción<span className='text-xs text-red-500'>*</span></label>
          <textarea onChange={onChange} id="descripcion" rows="5" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" placeholder="Descripción del producto..." value={producto.descripcion || ''} name="descripcion" />
        </div>

        <div className='flex gap-2 mb-2'>
          <input onChange={onChange} type="checkbox" name="destacados" id="destacados" checked={!!producto.destacados} />
          <label htmlFor="destacados" className="block text-sm font-medium text-gray-900">Destacado?</label>

          <input onChange={onChange} type="checkbox" name="usado" id="usado" checked={!!producto.usado} />
          <label htmlFor="usado" className="block text-sm font-medium text-gray-900">Usado?</label>

          <input onChange={onChange} type="checkbox" name="vendido" id="vendido" checked={!!producto.vendido} />
          <label htmlFor="vendido" className="block text-sm font-medium text-gray-900">Vendido</label>

          <input onChange={onChange} type="checkbox" name="hide" id="hide" checked={!!producto.hide} />
          <label htmlFor="hide" className="block text-sm font-medium text-gray-900">Ocultar</label>

          <input onChange={onChange} type="checkbox" name="stock" id="stock" checked={!!producto.stock} />
          <label htmlFor="stock" className="block text-sm font-medium text-gray-900">Sin Stock</label>
        </div>
      </div>

      <UploadImage imagenes={imagenes} updateImages={updateImages} handleRemoveImage={removeImage} />

      <div className="flex justify-center mt-6">
        <button aria-label="guardar cambios" type="submit" className="px-6 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg">{submitLabel}</button>
        <button aria-label="cerrar" type="button" onClick={onClose} className="ml-3 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancelar</button>
      </div>
    </form>
  );
}
