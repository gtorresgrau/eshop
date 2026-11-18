'use client';
import { useCallback, useEffect, useState } from 'react';

// Pide `url` (y vuelve a pedir si cambia). Cancela pedidos viejos y permite reintentar.
export function useEstadistica(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const control = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: control.signal })
      .then(async (r) => {
        const json = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(json.detalle || json.error || 'No se pudieron cargar las estadísticas.');
        return json;
      })
      .then(setData)
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setData(null);
        setError(e.message);
      })
      .finally(() => {
        if (!control.signal.aborted) setLoading(false);
      });
    return () => control.abort();
  }, [url, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);
  return { data, loading, error, reintentar };
}
