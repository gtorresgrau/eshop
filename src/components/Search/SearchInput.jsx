'use client';
import { IoClose } from 'react-icons/io5';

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar...',
  className = '',
  id,
  autoFocus,
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
}
