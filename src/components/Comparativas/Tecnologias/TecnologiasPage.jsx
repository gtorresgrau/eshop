import React from 'react';
import dynamic from 'next/dynamic';
import { tecnologiasData } from '../../constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const TecnologiasPage = () => {
  const { interfaces, pcie, display, wireless } = tecnologiasData;

  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title="Guía de tecnologías de conectividad para PC">
        Guía de Tecnologías y Conectividad
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">
        USB, PCIe, HDMI, DisplayPort, Wi-Fi y Bluetooth: entendé qué versión necesitás para tu PC, laptop o consola.
      </p>

      {/* USB */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 uppercase">🔌 Versiones USB</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Estándar</th>
                <th className="px-3 py-3">Velocidad</th>
                <th className="px-3 py-3">Color típico</th>
                <th className="px-3 py-3">Uso recomendado</th>
              </tr>
            </thead>
            <tbody>
              {interfaces.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{item.nombre}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{item.velocidad}</td>
                  <td className="px-3 py-2">{item.color}</td>
                  <td className="px-3 py-2 text-gray-600">{item.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">💡 Tip: El color del puerto indica la versión. Negro = USB 2.0, Azul = USB 3.0, Rojo/Teal = USB 3.1 Gen2, Rayo = Thunderbolt.</p>
      </article>

      {/* PCIe */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 uppercase">⚡ PCIe — Ranuras de Expansión</h2>
        <p className="text-sm text-gray-600 mb-4">
          PCI Express (PCIe) es la interfaz que conecta la GPU, SSDs NVMe, tarjetas de red y capturadoras a la placa madre. Cada generación duplica el ancho de banda de la anterior.
        </p>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Versión</th>
                <th className="px-3 py-3">Ancho de banda</th>
                <th className="px-3 py-3">Uso típico</th>
              </tr>
            </thead>
            <tbody>
              {pcie.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{item.version}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{item.ancho}</td>
                  <td className="px-3 py-2 text-gray-600">{item.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">💡 Retrocompatibilidad: una GPU PCIe 4.0 funciona en una ranura PCIe 3.0 con menor ancho de banda pero sin problemas de compatibilidad.</p>
      </article>

      {/* Display */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 uppercase">🖥️ Puertos de Video: HDMI vs DisplayPort</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Puerto</th>
                <th className="px-3 py-3">Resolución / Hz máx.</th>
                <th className="px-3 py-3">Uso ideal</th>
              </tr>
            </thead>
            <tbody>
              {display.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{item.puerto}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{item.resolucion}</td>
                  <td className="px-3 py-2 text-gray-600">{item.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
          <div className="border rounded p-3 bg-blue-50">
            <p><strong>HDMI</strong> es universal y compatible con TVs, consolas y casi cualquier pantalla. Ideal si conectás PC a TV o usás consola.</p>
          </div>
          <div className="border rounded p-3 bg-green-50">
            <p><strong>DisplayPort</strong> es el estándar para monitores gaming y profesionales. Soporta G-Sync/FreeSync y mayor tasa de refresco a misma resolución.</p>
          </div>
        </div>
      </article>

      {/* WiFi y Bluetooth */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 uppercase">📶 Wi-Fi y Bluetooth</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Estándar</th>
                <th className="px-3 py-3">Velocidad teórica</th>
                <th className="px-3 py-3">Bandas</th>
                <th className="px-3 py-3">Uso ideal</th>
              </tr>
            </thead>
            <tbody>
              {wireless.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{item.estandar}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{item.velocidad}</td>
                  <td className="px-3 py-2">{item.banda}</td>
                  <td className="px-3 py-2 text-gray-600">{item.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">💡 Para gaming online siempre recomendamos cable Ethernet. Wi-Fi 6 o 6E si es inevitable — menor latencia y más estable que Wi-Fi 5.</p>
      </article>

      {/* Guía práctica */}
      <article className="border rounded-lg p-6 shadow-lg bg-gray-50 mb-10">
        <h2 className="text-xl font-bold text-primary mb-4 text-center">🎯 Guía rápida de conectividad</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p>🎮 <strong>Gaming 144Hz 1080p</strong>: DisplayPort 1.4 o HDMI 2.0</p>
            <p>🎮 <strong>Gaming 4K 144Hz</strong>: HDMI 2.1 o DisplayPort 1.4/2.0</p>
            <p>💾 <strong>Disco externo rápido</strong>: USB 3.2 Gen2 (10 Gbps) mínimo</p>
            <p>🖥️ <strong>Dock para laptop</strong>: Thunderbolt 4 o USB4 (40 Gbps)</p>
          </div>
          <div className="space-y-2">
            <p>📶 <strong>Gaming online sin cable</strong>: Wi-Fi 6 o 6E con router compatible</p>
            <p>🎧 <strong>Auriculares / controles</strong>: Bluetooth 5.0 o superior</p>
            <p>🔥 <strong>GPU nueva en placa vieja</strong>: PCIe 4.0 en slot 3.0 → OK, ~5% pérdida</p>
            <p>📺 <strong>PC a TV / proyector</strong>: HDMI 2.0 o 2.1 según resolución</p>
          </div>
        </div>
      </article>

      <Comparativas />
    </section>
  );
};

export default TecnologiasPage;
