import React from 'react';

export default function SkeletonCard() {
  return (
    <li className='relative xs:w-44 sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96 sm:min-h-[320px] md:min-h-[430px] lg:min-h-[420px] xl:min-h-[465px] list-none'>
      <div className="relative flex flex-col justify-around w-full h-full bg-white border border-gray-200 rounded-lg shadow animate-pulse">
        <div className="relative flex justify-center bg-gray-300 rounded-t-lg w-full xs:w-36 xs:h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 xl:w-64 xl:h-64 md:w-60 md:h-60"></div>
        <div className="absolute top-1 left-1 w-20 h-6 bg-gray-400 rounded-md"></div>
        <div className='px-4 py-1'>
          <div className="mb-1 min-h-10 bg-gray-300 h-4 w-3/4 rounded-md"></div>
          <div className="pb-1">
            <div className="bg-gray-300 h-3 w-1/2 mb-1 rounded-md"></div>
            <div className="bg-gray-300 h-3 w-3/4 mb-1 rounded-md"></div>
            <div className="bg-gray-300 h-3 w-1/3 rounded-md"></div>
          </div>
        </div>
        <div className="px-2 pb-1 flex justify-between gap-2">
          <div className="w-20 h-8 bg-gray-300 rounded-lg"></div>
          <div className="w-20 h-8 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </li>
  );
}