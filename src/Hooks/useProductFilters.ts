import { useState, useEffect } from 'react';

const useProductFilters = (searchParams, router, isAdminPage) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    setSelectedCategories(searchParams.getAll('category'));
    setSelectedBrands(searchParams.getAll('brand'));
  }, [searchParams]);

  const pushUpdatedParams = (params, hash = '') => {
    const url = isAdminPage ? `/Admin?${params.toString()}` : `/?${params.toString()}${hash}`;
    router.push(url);
  };

  const handleCheckboxChange = (e, key, selectedValues, setSelectedValues) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setSelectedValues((prev) => {
      const newSelected = isChecked ? [...prev, value] : prev.filter((item) => item !== value);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.set('page', '1');
      if (newSelected.length > 0) {
        newSelected.forEach((val) => params.append(key, val));
      }
      pushUpdatedParams(params, isAdminPage ? '' : '#productos');
      return newSelected;
    });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('category');
    params.delete('brand');
    params.set('page', '1');
    setSelectedCategories([]);
    setSelectedBrands([]);
    pushUpdatedParams(params, isAdminPage ? '' : '#productos');
  };

  return { selectedCategories, selectedBrands, setSelectedCategories, setSelectedBrands, handleCheckboxChange, handleClearFilters };
};

export default useProductFilters;
