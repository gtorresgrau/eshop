import { useState } from 'react';

interface Router {
  push: (url: string) => void;
}

const useURLParams = (
  searchParams: URLSearchParams,
  router: Router,
  isAdminPage: boolean
) => {
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const pushUpdatedParams = (params: URLSearchParams, hash = '') => {
    const url = isAdminPage
      ? `/Admin?${params.toString()}`
      : `/?${params.toString()}${hash}`;
    router.push(url);
  };

  return { pushUpdatedParams, currentPage, setCurrentPage };
};

export default useURLParams;
