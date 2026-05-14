'use client'
import { useState } from "react"
import SearchInput from '../../Search/SearchInput'

const SearchInPresupuesto = ({ products, onSelect }) => {
  const [search, setSearch] = useState('')

  const filtered = products.filter(p => {
    const nombre = typeof p.nombre === 'string' ? p.nombre.toLowerCase() : '';
    const codigo = typeof p.codigo === 'string' ? p.codigo.toLowerCase() : '';
    return nombre.includes(search.toLowerCase()) || codigo.includes(search.toLowerCase());
  });

  return (
    <div>
      <SearchInput
        value={search}
        onChange={e => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        placeholder="Buscar por nombre o código..."
        className="mb-4"
        autoFocus
      />
      <ul className="max-h-64 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="p-4 text-center text-gray-500 text-sm">No se encontraron productos</li>
        )}
        {filtered.map((prod, i) => (
          <li key={i} onClick={() => onSelect(prod)} className="cursor-pointer hover:bg-gray-100 p-2 border-b">
            <div className="font-semibold">{prod.nombre}</div>
            <div className="text-sm text-gray-600">Código: {prod.cod_producto}</div>
            <div className="text-sm text-gray-600">Precio: {prod.precio ? `$${prod.precio}` : 'Sin precio'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchInPresupuesto
