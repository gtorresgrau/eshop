import React from 'react';
import dynamic from 'next/dynamic';
import { procesadorOptions, procesadorComparison } from '../../constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const ProcesadoresPage = () => {
  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title="Comparativa de Procesadores Intel vs AMD">
        Comparativa de Procesadores Intel vs AMD
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Guía completa para elegir el mejor procesador según tu uso: gaming, edición de video, streaming o workstation profesional.
      </p>

      {/* Gamas */}
      <article className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {procesadorOptions.map((option, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-lg text-center hover:shadow-xl hover:scale-105 hover:shadow-blue-200 transition-all">
            <div className="text-4xl mb-3">
              {index === 0 ? '🟢' : index === 1 ? '🔵' : index === 2 ? '🟣' : '🔴'}
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">{option.title}</h2>
            <p className="text-gray-600 text-sm">{option.description}</p>
          </div>
        ))}
      </article>

      {/* Intel vs AMD general */}
      <article className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded-lg p-5 shadow-lg bg-blue-50">
          <h2 className="text-xl font-bold text-center text-blue-700 mb-4">🔵 Intel — Puntos Clave</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✅ <strong>Mayor IPC</strong> en cargas de trabajo single-thread (gaming)</li>
            <li>✅ <strong>Integración GPU</strong> (Intel UHD/Iris Xe) en casi todos los modelos</li>
            <li>✅ <strong>Arquitectura híbrida</strong> (P-cores + E-cores) desde Gen 12</li>
            <li>✅ <strong>Compatibilidad amplia</strong> DDR4 y DDR5 en LGA1700</li>
            <li>⚠️ Mayor consumo (TDP) en los modelos K sin límite de potencia</li>
            <li>⚠️ Socket LGA1700 sin planes de continuidad más allá de Gen 14</li>
          </ul>
        </div>
        <div className="border rounded-lg p-5 shadow-lg bg-red-50">
          <h2 className="text-xl font-bold text-center text-red-600 mb-4">🔴 AMD — Puntos Clave</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✅ <strong>Mejor eficiencia energética</strong>, menor TDP por rendimiento</li>
            <li>✅ <strong>Socket AM5 con futuro</strong>: compatible con Ryzen 7000, 8000 y 9000</li>
            <li>✅ <strong>Tecnología 3D V-Cache</strong> (X3D) para gaming extremo</li>
            <li>✅ <strong>Más núcleos</strong> a igual precio en gama alta</li>
            <li>⚠️ GPU integrada limitada (solo RDNA2 básico en Ryzen 7000)</li>
            <li>⚠️ AM5 requiere DDR5 exclusivamente (mayor costo de plataforma)</li>
          </ul>
        </div>
      </article>

      {/* Tabla comparativa */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary uppercase">
          Tabla Comparativa de Procesadores 2025
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Modelo</th>
                <th className="px-3 py-3">Núcleos</th>
                <th className="px-3 py-3">Frecuencia</th>
                <th className="px-3 py-3">TDP</th>
                <th className="px-3 py-3">Socket</th>
                <th className="px-3 py-3">RAM</th>
                <th className="px-3 py-3">Precio</th>
                <th className="px-3 py-3">Uso ideal</th>
              </tr>
            </thead>
            <tbody>
              {procesadorComparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{row.modelo}</td>
                  <td className="px-3 py-2">{row.nucleos}</td>
                  <td className="px-3 py-2">{row.frecuencia}</td>
                  <td className="px-3 py-2">{row.tdp}</td>
                  <td className="px-3 py-2 text-xs">{row.socket}</td>
                  <td className="px-3 py-2 text-xs">{row.ram}</td>
                  <td className="px-3 py-2">{row.precio}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{row.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* Conceptos clave */}
      <article className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🔢 Núcleos y Threads</h3>
          <p className="text-sm text-gray-600">
            Los núcleos físicos (<strong>Cores</strong>) ejecutan tareas en paralelo. Los threads virtuales (<strong>Hyperthreading / SMT</strong>) duplican la capacidad lógica.
            <br /><br />
            Para gaming: 6-8 núcleos son suficientes. Para renderizado o compilación: 12-32 núcleos hacen la diferencia.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">⚡ Frecuencia y Boost</h3>
          <p className="text-sm text-gray-600">
            La <strong>frecuencia base</strong> es la velocidad mínima garantizada. La <strong>frecuencia boost</strong> es el pico alcanzable con buena refrigeración.
            <br /><br />
            Mayor GHz = mejor rendimiento en tareas de un solo núcleo como gaming. Los procesadores <strong>K</strong> (Intel) y <strong>X</strong> (AMD) son desbloqueados para overclock.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🌡️ TDP y Refrigeración</h3>
          <p className="text-sm text-gray-600">
            El <strong>TDP (Thermal Design Power)</strong> indica el calor máximo generado. Un TDP alto requiere mejor refrigeración (torre de 2 torres o AIO líquida).
            <br /><br />
            Procesadores 65W: cooler stock suficiente. 125W+: necesitan cooler de calidad. 170W+: refrigeración líquida recomendada.
          </p>
        </div>
      </article>

      {/* Guía de elección */}
      <article className="border rounded-lg p-6 shadow-lg bg-gray-50 mb-10">
        <h2 className="text-xl font-bold text-primary mb-4 text-center">🎯 ¿Cuál elegir según tu uso?</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p>🎮 <strong>Gaming 1080p casual</strong>: Intel i3-13100 / Ryzen 5 5600</p>
            <p className="mt-2">🎮 <strong>Gaming 1440p / Streaming</strong>: i5-13600K / Ryzen 5 7600X</p>
            <p className="mt-2">🎮 <strong>Gaming 4K / Streaming 4K</strong>: i7-14700K / Ryzen 7 7700X</p>
            <p className="mt-2">🏆 <strong>Gaming extremo (frames máximos)</strong>: Ryzen 7 7800X3D (3D V-Cache)</p>
          </div>
          <div>
            <p>🎬 <strong>Edición de video FHD/4K</strong>: i7-14700K / Ryzen 9 7900X</p>
            <p className="mt-2">🖥️ <strong>Workstation / Renderizado 3D</strong>: Ryzen 9 7950X / i9-14900K</p>
            <p className="mt-2">💼 <strong>Ofimática y uso cotidiano</strong>: i3-13100 / Ryzen 3 4100</p>
            <p className="mt-2">🤖 <strong>Inteligencia Artificial / Data Science</strong>: Ryzen Threadripper Pro</p>
          </div>
        </div>
      </article>

      <Comparativas />
    </section>
  );
};

export default ProcesadoresPage;
