import React from 'react'
import SkeletonFilter from './SkeletonFilter'

const Filtros = ({
    handleCheckboxChange,
    handleClearFilters,
    isLoading,
    
    categories,
    handleShowAllCategories,
    showAllCategories,
    selectedCategories,
    setSelectedCategories,
    
    brands,
    handleShowAllBrands,
    showAllBrands,
    selectedBrands,
    setSelectedBrands,
}) => {

  return (
        <section>
            <button onClick={handleClearFilters} className="text-white bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active font-medium rounded-lg text-sm px-4 py-2 w-full" aria-label='limpiar filtros'>Limpiar Filtros</button>
            <div className='flex flex-col'>
              <h3 className='mx-2 mt-4 text-blue-600'>CATEGORIAS</h3>
                  {isLoading
                    ?<SkeletonFilter /> 
                    :categories.slice(0, showAllCategories ? categories.length : 5).map(({ category, count }) => (
                        <label key={category} className='align-middle'>
                        <input type="checkbox" value={category} checked={selectedCategories.includes(category)} onChange={(e) => handleCheckboxChange(e, "category", selectedCategories, setSelectedCategories )}/> {category} ({count})</label>
                      ))}
                    {categories.length > 5 && (<button  onClick={handleShowAllCategories} className="px-4 text-blue-700 hover:text-white hover:bg-blue-400 rounded border cursor-pointer my-2 w-full" >{showAllCategories ? "Ver menos..." : "Ver más..."}</button>)}
              </div>
              <div className='flex flex-col'>
                <h3 className='mx-2 mt-4 text-blue-600'>MARCAS</h3>
                    {isLoading 
                    ?<SkeletonFilter/>
                    :brands.slice(0, showAllBrands ? brands.length : 5).map(({ brand, count }) => (
                        <label key={brand} >
                        <input type="checkbox" value={brand} checked={selectedBrands.includes(brand)} onChange={(e) => handleCheckboxChange( e,"brand", selectedBrands, setSelectedBrands)}/> {brand} ({count})</label>
                      ))}
                    {brands.length > 5 && (<button onClick={handleShowAllBrands} className="px-4 text-blue-700 hover:text-white hover:bg-blue-400 rounded border cursor-pointer my-2 w-full">{showAllBrands ? "Ver menos..." : "Ver más..."} </button>)}
              </div>
              <button onClick={handleClearFilters} className="text-white bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active font-medium rounded-lg text-sm px-4 py-2 my-2 w-full" aria-label='limpiar filtros'>Limpiar Filtros</button>
        </section>
  )
};

export default Filtros