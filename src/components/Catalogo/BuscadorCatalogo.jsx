/**
 * Buscador del catálogo. Es un formulario GET común: funciona sin JavaScript y busca dentro
 * de la sección actual (todo el catálogo, una categoría o una marca).
 */
export default function BuscadorCatalogo({ action, q = '', placeholder = 'Buscar productos' }) {
  return (
    <form action={action} method="get" role="search" className="flex">
      <label htmlFor="q-catalogo" className="sr-only">Buscar productos</label>
      <input
        id="q-catalogo"
        name="q"
        type="search"
        defaultValue={q}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={80}
        className="h-14 min-w-0 flex-1 bg-gray-100 px-5 text-base text-gray-900 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700"
      />
      <button
        type="submit"
        className="h-14 shrink-0 bg-orange-700 px-7 text-base font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
      >
        Buscar
      </button>
    </form>
  );
}
