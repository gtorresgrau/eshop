const SkeletonDestacado = () => {
    return (
        <li className='relative w-44 md:w-60 min-h-48 md:min-h-72 list-none'>
          <div className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow animate-pulse p-2">
            {/* Icono del carrito */}
            <div className="absolute top-1 right-1 w-8 h-8 bg-gray-300 rounded-full"></div>
            
            {/* Imagen destacada */}
            <div className="absolute top-[-15px] left-[-15px] w-10 h-10 xl:w-14 xl:h-14 bg-gray-300 rounded-full"></div>
            
            {/* Imagen principal */}
            <div className="w-full h-32 md:w-48 md:h-48 lg:w-52 lg:h-52 bg-gray-300 rounded-lg"></div>
            
            <div className="px-5 pb-2">
              {/* Título */}
              <div className="h-4 w-3/4 bg-gray-300 rounded-md mb-1"></div>
              
              {/* Marca y botón de consulta */}
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </li>
    );
  };
  
  export default SkeletonDestacado;
  