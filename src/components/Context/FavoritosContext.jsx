'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CLAVE = 'favoritos';
const MAX = 200;

// Solo lo necesario para mostrar la card y comprar: no se guarda la descripción ni nada pesado.
const CAMPOS = ['_id', 'cod_producto', 'nombre', 'titulo_de_producto', 'marca', 'categoria', 'precio', 'usd', 'descuento',
  'foto_1_1', 'destacados', 'usado', 'vendido', 'stock', 'cantidad', 'origen'];

const compactar = (p) => Object.fromEntries(CAMPOS.filter((k) => p?.[k] !== undefined).map((k) => [k, p[k]]));

const FavoritosContext = createContext({ favoritos: [], esFavorito: () => false, alternar: () => {} });

/** Favoritos del visitante, guardados en este navegador (no hace falta iniciar sesión). */
export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      if (Array.isArray(guardado)) setFavoritos(guardado);
    } catch { /* sin favoritos guardados o almacenamiento bloqueado */ }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try { localStorage.setItem(CLAVE, JSON.stringify(favoritos)); } catch { /* lleno o bloqueado: sigue en memoria */ }
  }, [favoritos, listo]);

  const esFavorito = useCallback((cod) => favoritos.some((f) => f.cod_producto === cod), [favoritos]);

  const alternar = useCallback((producto) => {
    const cod = producto?.cod_producto;
    if (!cod) return;
    const estaba = favoritos.some((f) => f.cod_producto === cod);
    setFavoritos((prev) => (estaba ? prev.filter((f) => f.cod_producto !== cod) : [compactar(producto), ...prev].slice(0, MAX)));
    toast(estaba ? 'Quitado de favoritos' : 'Guardado en favoritos', { icon: estaba ? '🤍' : '❤️' });
  }, [favoritos]);

  const valor = useMemo(() => ({ favoritos, esFavorito, alternar }), [favoritos, esFavorito, alternar]);
  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export const useFavoritos = () => useContext(FavoritosContext);
