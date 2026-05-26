import React from 'react';
import dynamic from 'next/dynamic';
import { motherboardData } from '../../constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const MothersPage = () => {
  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title="Comparación de Placas Madre Intel y AMD">
        Comparación de Motherboards Intel vs AMD
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Chipsets, sockets, factores de forma y características clave para elegir la placa madre correcta para tu build.
      </p>

      {/* Sockets Intel vs AMD */}
      <article className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="border p-5 rounded-lg shadow-lg bg-blue-50">
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-3">🔵 Intel — Sockets y Chipsets</h2>
          <p className="text-sm mt-2"><strong>Sockets actuales:</strong> {motherboardData.intel.sockets.join(', ')}</p>
          <p className="text-sm mt-2"><strong>Chipsets:</strong> {motherboardData.intel.chipsets.join(', ')}</p>
          <p className="text-sm mt-2"><strong>Compatibilidad:</strong> {motherboardData.intel.compatibility}</p>
          <div className="mt-4 space-y-1 text-sm text-gray-700">
            <p>🔹 <strong>Z790 / Z690</strong>: Overclock desbloqueado, más fases VRM, PCIe 5.0 completo</p>
            <p>🔹 <strong>B760 / B660</strong>: Gama media, sin OC de CPU, buena conectividad</p>
            <p>🔹 <strong>H610</strong>: Básico, sin OC, ideal para oficina y builds económicos</p>
          </div>
        </div>
        <div className="border p-5 rounded-lg shadow-lg bg-red-50">
          <h2 className="text-xl font-semibold text-center text-red-600 mb-3">🔴 AMD — Sockets y Chipsets</h2>
          <p className="text-sm mt-2"><strong>Sockets actuales:</strong> {motherboardData.amd.sockets.join(', ')}</p>
          <p className="text-sm mt-2"><strong>Chipsets:</strong> {motherboardData.amd.chipsets.join(', ')}</p>
          <p className="text-sm mt-2"><strong>Compatibilidad:</strong> {motherboardData.amd.compatibility}</p>
          <div className="mt-4 space-y-1 text-sm text-gray-700">
            <p>🔹 <strong>X670E / X670</strong>: Entusiasta, PCIe 5.0 en GPU y M.2, OC completo</p>
            <p>🔹 <strong>B650E / B650</strong>: Gama media, PCIe 5.0 parcial, buen precio</p>
            <p>🔹 <strong>A620</strong>: Básico, sin OC de CPU, precio bajo</p>
          </div>
        </div>
      </article>

      {/* Explicación chipsets */}
      <article className="mb-6 border p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center text-primary mb-4">🔎 Cómo leer los Chipsets</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-blue-700 mb-1">Intel</p>
            <p>{motherboardData.chipsetExplanation.intel}</p>
          </div>
          <div>
            <p className="font-semibold text-red-600 mb-1">AMD</p>
            <p>{motherboardData.chipsetExplanation.amd}</p>
          </div>
        </div>
      </article>

      {/* Factores de forma */}
      <article className="mb-6 border p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center text-primary mb-4">📐 Factores de Forma (Form Factors)</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(motherboardData.formFactors).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-3 text-center bg-gray-50">
              <p className="font-bold text-primary text-sm mb-1">{key}</p>
              <p className="text-xs text-gray-600">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">💡 El form factor de la placa debe coincidir con el gabinete. ATX y MicroATX son los más comunes para gaming y trabajo.</p>
      </article>

      {/* Características adicionales */}
      <article className="mb-6 border p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center text-primary mb-4">⚙️ Características a Verificar al Comprar</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(motherboardData.additionalFeatures).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-3 bg-gray-50">
              <p className="font-semibold text-primary text-sm mb-1 capitalize">
                {key === 'ramSupport' ? '💾 Soporte de RAM' :
                 key === 'connectivity' ? '🔌 Conectividad I/O' :
                 key === 'storage' ? '💿 Almacenamiento' :
                 key === 'expansion' ? '📦 Ranuras de Expansión' :
                 key === 'audio' ? '🔊 Audio' :
                 key === 'power' ? '⚡ VRM / Fases de Potencia' :
                 key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-xs text-gray-600">{value}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Guía de elección */}
      <article className="border rounded-lg p-6 shadow-lg bg-gray-50 mb-10">
        <h2 className="text-xl font-bold text-primary mb-4 text-center">🎯 ¿Qué placa madre elegir?</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p>💼 <strong>PC de oficina / básica</strong>: H610 (Intel) o A620 (AMD) + CPU sin letra K/X</p>
            <p>🎮 <strong>Gaming sin OC</strong>: B760 (Intel LGA1700) o B650 (AMD AM5)</p>
            <p>🎮 <strong>Gaming con Overclock</strong>: Z790 (Intel) o X670 (AMD) con CPU K/X</p>
          </div>
          <div className="space-y-2">
            <p>🖥️ <strong>Workstation</strong>: Z790 o X670E con soporte DDR5 y PCIe 5.0</p>
            <p>🔄 <strong>Actualizar placa vieja AM4</strong>: B550 o X570 para Ryzen 5000 sin cambiar socket</p>
            <p>💡 <strong>Presupuesto ajustado</strong>: B760 / B650 son la mejor relación calidad-precio actualmente</p>
          </div>
        </div>
      </article>

      <Comparativas />
    </section>
  );
};

export default MothersPage;
