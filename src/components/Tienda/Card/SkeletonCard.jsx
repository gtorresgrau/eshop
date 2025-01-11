import React from 'react';

export default function SkeletonCard() {
  return (
    <li className='relative w-36 xs:w-40 sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96 sm:min-h-[320px] md:min-h-[430px] lg:min-h-[420px] xl:min-h-[465px] list-none'>
  <div className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
    <div className="animate-pulse">
      <div className="flex justify-center relative">
        
        <div className="rounded-lg bg-gray-300 h-[8.8rem] xs:w-36 xs:h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 xl:w-64 xl:h-64 m-2"></div>
      </div>
      <p className="top-[-20px] bg-gray-300 text-end text-gray-700 px-2 font-extralight text-xs"><strong> </strong></p>
      <div className="px-4 py-1">
        <h2 className="mb-1 text-lg font-bold tracking-tight text-gray-900 bg-gray-300 h-5"></h2>
        <div className="pb-2 text-left">
          <p className="text-xs text-gray-700 bg-gray-300 h-3"></p>
          <p className="hidden md:block text-xs text-gray-700 bg-gray-300 h-3"></p>
          <p className="text-xs text-gray-700 bg-gray-300 h-3"></p>
          <p className="text-xs text-gray-700 bg-gray-300 h-3"></p>
          <p className="text-xs text-gray-700 bg-gray-300 h-3"></p>
        </div>
      </div>
    </div>
    <div className='px-2 pb-2'>
      <div className="w-full h-6 md:h-8 bg-gray-300 rounded-md"></div>
    </div>
  </div>
</li>

  );
}
