'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useState, useEffect } from "react";
import { IoCartOutline } from 'react-icons/io5';
import { CartContext } from '../Context/ShoopingCartContext';
import Link from "next/link";
import SearchInput from './SearchInput';

const SearchBase = ({ inputClassName = '', placeholder = 'Buscar...' }) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [isScrolled, setIsScrolled] = useState(false);
  const [cart] = useContext(CartContext);

  const quantity = cart?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("search", searchInput);
      params.set("page", 1);
    } else {
      params.delete("search");
    }
    const newPath = path === '/Admin' ? '/Admin' : '/';
    router.push(`${newPath}?${params.toString()}#productos${newPath === '/Admin' ? 'Admin' : ''}`);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    const newPath = path === '/Admin' ? '/Admin' : '/';
    router.push(`${newPath}?${params.toString()}#productos${newPath === '/Admin' ? 'Admin' : ''}`);
  };

  const cartBadgeVisible = quantity > 0;
  const isHomePage = path === '/';
  const containerClass = `flex items-center justify-between max-w-xl mx-auto sticky top-0 z-40 ${
    isScrolled ? 'bg-white w-full rounded-lg shadow-md' : ''
  }`;

  return (
      <div id="searchSticky" className={containerClass}>
        <form id="formSearchBar" onSubmit={handleSearch} className={`relative flex-1 ${inputClassName}`}>
          <label htmlFor="default-search" className="sr-only">Buscar</label>
          <div className="flex items-center gap-2">
            <SearchInput
              id="default-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClear={handleClearSearch}
              placeholder={placeholder}
              className="flex-1"
            />
            <button
              type="submit"
              className="text-white font-medium rounded-lg text-sm px-4 py-2 bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active whitespace-nowrap"
              aria-label="buscar"
            >
              BUSCAR
            </button>
          </div>
        </form>
        {isHomePage && (
          <div className={`relative ${isScrolled ? 'block' : 'hidden'}`}>
            <Link href="/Shopcart" title="Ir al carrito de compras">
              {cartBadgeVisible && (
                <div className="absolute text-white px-2 m-1 rounded-full right-[10px] top-[-15px] bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active">
                  {quantity}
                </div>
              )}
              <IoCartOutline size={30} className="mx-5" />
            </Link>
          </div>
        )}
      </div>
  );
};

export default SearchBase;
