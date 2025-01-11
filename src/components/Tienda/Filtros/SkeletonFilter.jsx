import React from "react";

export default function SkeletonFilter({w}) {
  return (
    <div>
      <div role="status" className="max-w-sm animate-pulse mt-2">
        <div className="h-4 bg-gray-200 rounded-full  w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-full  w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-full  w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-full  w-20 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-full  w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded-md w-40 mb-2.5"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
