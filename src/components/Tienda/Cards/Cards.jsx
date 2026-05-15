import Card from '../Card/Card';
import SkeletonCard from '../Card/SkeletonCard';
import { useMediaQuery, Pagination } from '@mui/material';

const Cards = ({
  productos,
  handleProductSelect,
  isLoading,
  currentPage,
  handlePageChange,
  hasActiveFilters = false,
  totalDisponibles = 0,
  searchQuery = '',
}) => {
  const isMobile    = useMediaQuery('(max-width: 767px)');
  const itemsPerPage = isMobile ? 8 : 9;

  const startIndex       = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = productos.slice(startIndex, startIndex + itemsPerPage);
  const totalPages       = Math.ceil(productos.length / itemsPerPage);

  return (
    <section className="w-full">

      {/* ── Barra de resultados ── */}
      {!isLoading && (
        <div className="flex items-center justify-between px-3 py-2 max-w-7xl mx-auto">
          <p className="text-sm text-gray-500">
            {hasActiveFilters ? (
              <>
                <span className="font-semibold text-gray-800">{productos.length}</span>
                {' '}resultado{productos.length !== 1 ? 's' : ''}
                {searchQuery && (
                  <span className="text-orange-600"> para &ldquo;{searchQuery}&rdquo;</span>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-800">{totalDisponibles}</span>
                {' '}producto{totalDisponibles !== 1 ? 's' : ''} disponible{totalDisponibles !== 1 ? 's' : ''}
              </>
            )}
          </p>

          {totalPages > 1 && (
            <p className="text-xs text-gray-400">
              Página {currentPage} de {totalPages}
            </p>
          )}
        </div>
      )}

      {/* ── Paginación superior ── */}
      {totalPages > 1 && !isLoading && (
        <nav
          aria-label="Paginación de productos"
          className="flex justify-center my-3"
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => handlePageChange(value)}
            siblingCount={1}
            boundaryCount={1}
            size="medium"
            variant="outlined"
            shape="rounded"
          />
        </nav>
      )}

      {/* ── Grid de productos ── */}
      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-1 w-full mx-auto md:max-w-7xl px-2 sm:px-6 lg:px-8 justify-items-center">
        {isLoading ? (
          [...Array(9)].map((_, i) => (
            <li key={i} className="w-full">
              <SkeletonCard />
            </li>
          ))
        ) : paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <li key={product.cod_producto} className={product.hide ? 'hidden' : ''}>
              <Card product={product} handleProductSelect={handleProductSelect} />
            </li>
          ))
        ) : (
          /* ── Estado vacío mejorado ── */
          <li className="col-span-2 lg:col-span-3 py-12 w-full">
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div className="text-5xl">🔍</div>
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-1">
                  No encontramos productos
                </p>
                <p className="text-sm text-gray-400 max-w-sm">
                  {searchQuery
                    ? `No hay resultados para "${searchQuery}". Probá con otros términos o quitá algún filtro.`
                    : 'Ningún producto coincide con los filtros seleccionados. Intentá con una combinación diferente.'}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center mt-2">
                <a
                  href="/#productos"
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                >
                  Ver todos los productos
                </a>
              </div>
            </div>
          </li>
        )}
      </ul>

      {/* ── Paginación inferior ── */}
      {totalPages > 1 && !isLoading && (
        <nav
          aria-label="Paginación de productos"
          className="flex justify-center my-4"
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => handlePageChange(value)}
            siblingCount={1}
            boundaryCount={1}
            size="medium"
            variant="outlined"
            shape="rounded"
          />
        </nav>
      )}
    </section>
  );
};

export default Cards;
