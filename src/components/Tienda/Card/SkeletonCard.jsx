import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="relative xs:w-44 sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96 md:min-h-[320px] lg:min-h-[360px] xl:min-h-[420px] list-none cursor-pointer">
      <div className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow animate-pulse">
        <div>
          <div className="relative aspect-square bg-gray-200">
            <div className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full"></div>
            <div className="bg-gray-300 rounded-t-lg w-full h-full" />
          </div>
          <div className="px-4 py-1">
            <div className="h-5 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
          </div>
        </div>
        <div className="px-2 pb-1 flex gap-2 justify-center">
          <div className="h-8 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}