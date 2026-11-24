import React from 'react';
import dynamic from 'next/dynamic';
const Comparativas = dynamic(() => import('../Comparativas'));

/**
 * Plantilla de las guías de infraestructura (switches, core, patcheras, servidores).
 * Mismo esquema que las demás comparativas: título, cards, tabla, conceptos y guía de elección.
 */
export default function GuiaTecnica({ titulo, intro, opciones, tablaTitulo, columnas, filas, conceptos, eleccionTitulo, elecciones }) {
  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title={titulo}>
        {titulo}
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">{intro}</p>

      <article className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {opciones.map((o) => (
          <div key={o.title} className="border rounded-lg p-4 shadow-lg text-center hover:shadow-xl hover:scale-105 hover:shadow-blue-200 transition-all">
            <div className="text-4xl mb-3">{o.emoji}</div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">{o.title}</h2>
            <p className="text-gray-600 text-sm">{o.description}</p>
          </div>
        ))}
      </article>

      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary uppercase">{tablaTitulo}</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                {columnas.map((c) => <th key={c} className="px-3 py-3">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={fila[0]} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {fila.map((celda, j) => (
                    <td key={j} className={`px-3 py-2 ${j === 0 ? 'font-medium text-gray-800' : 'text-gray-700'}`}>{celda}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="grid md:grid-cols-3 gap-6 mb-10">
        {conceptos.map((c) => (
          <div key={c.title} className="border rounded-lg p-4 shadow">
            <h3 className="font-bold text-primary mb-2">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.text}</p>
          </div>
        ))}
      </article>

      <article className="border rounded-lg p-6 shadow-lg bg-gray-50 mb-10">
        <h2 className="text-xl font-bold text-primary mb-4 text-center">{eleccionTitulo}</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          {elecciones.map(([uso, rec]) => (
            <p key={uso}><strong>{uso}</strong>: {rec}</p>
          ))}
        </div>
      </article>

      <Comparativas />
    </section>
  );
}
