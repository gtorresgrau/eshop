const SkeletonDestacado = () => {
    return (
      <li className="relative bg-white border border-gray-200 rounded-lg shadow list-none min-h-48 w-44 md:min-w-60 md:min-h-72 animate-pulse">
        <div className="flex justify-center relative">
          <div className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 z-10"></div>
          <div className="absolute top-[-15px] left-[-15px] xl:top-[-15px] xl:left-[-15px] xl:w-14 xl:h-14 w-10 inline-flex items-center justify-center bg-gray-300 rounded-full z-10"></div>
          <div className="rounded-lg overflow-hidden p-2">
            <div className="bg-gray-300 rounded-lg p-2 w-28 h-28 md:w-48 md:h-48 lg:w-52 lg:h-52"></div>
          </div>
        </div>
        <div className="px-5 pb-2">
          <h2 className="lg:text-lg text-sm text-start leading-tight pb-1 font-semibold tracking-tight text-gray-900">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </h2>
          <div className="flex items-center justify-between gap-2">
            <span className="text-md font-bold text-gray-900">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </span>
            <div className="w-full h-8 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </li>
    );
  };
  
  export default SkeletonDestacado;
  