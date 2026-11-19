'use client';
import { useEffect, useMemo, useState } from 'react';

const fecha = (d) => (d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');

/** Usuarios registrados: lista con buscador. Solo lectura. */
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/admin/usuarios', { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
        setUsuarios(d.usuarios);
      })
      .catch((e) => setError(e.message));
  }, []);

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!usuarios) return [];
    return t ? usuarios.filter((u) => `${u.nombreCompleto} ${u.correo} ${u.telefono}`.toLowerCase().includes(t)) : usuarios;
  }, [usuarios, q]);

  if (error) return <p className="p-4 text-red-700">{error}</p>;
  if (!usuarios) return <p className="p-4 text-gray-700">Cargando usuarios…</p>;

  return (
    <div className="p-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Usuarios registrados ({usuarios.length})</h2>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, correo o teléfono"
          className="w-full max-w-sm rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-900">
          <thead className="bg-gray-400 text-xs uppercase">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Correo</th>
              <th className="px-3 py-2">Rol</th>
              <th className="px-3 py-2">Teléfono</th>
              <th className="px-3 py-2">Ciudad</th>
              <th className="px-3 py-2">Registro</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((u) => (
              <tr key={u._id} className="border-b border-gray-300 bg-white">
                <td className="px-3 py-2 font-medium">{u.nombreCompleto || '—'}</td>
                <td className="px-3 py-2">{u.correo}</td>
                <td className="px-3 py-2">{u.rol}</td>
                <td className="px-3 py-2">{u.telefono || '—'}</td>
                <td className="px-3 py-2">{[u.direccion?.ciudad, u.direccion?.provincia].filter(Boolean).join(', ') || '—'}</td>
                <td className="px-3 py-2">{fecha(u.fechaRegistro)}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-700">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
