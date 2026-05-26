import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ramOptions, ramComparison } from '../../constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const MemoriaRamPage = () => {
  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title="Comparación de Tipos de Memoria RAM">
        Comparación de Tipos de Memoria RAM
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">
        DDR3, DDR4, DDR5 y ECC: diferencias en velocidad, voltaje, capacidad y compatibilidad. Elegí la RAM correcta para tu plataforma.
      </p>

      {/* Cards */}
      <article className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {ramOptions.map((option, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-lg text-center hover:shadow-xl hover:scale-105 hover:shadow-blue-200 transition-all">
            <Image
              src={option.img}
              alt={option.alt}
              className="w-full h-auto object-cover mb-4 rounded-md"
              title={option.alt}
              aria-label={`Imagen de ${option.title}`}
              loading="lazy"
              width={400}
              height={80}
            />
            <h2 className="text-lg font-semibold mb-2">{option.title}</h2>
            <p className="text-gray-600 text-sm">{option.description}</p>
          </div>
        ))}
      </article>

      {/* Tabla comparativa */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary uppercase">
          Tabla Comparativa Completa de RAM
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Velocidad</th>
                <th className="px-3 py-3">Voltaje</th>
                <th className="px-3 py-3">Canales</th>
                <th className="px-3 py-3">Cap. máx.</th>
                <th className="px-3 py-3">Precio</th>
                <th className="px-3 py-3">Uso ideal</th>
              </tr>
            </thead>
            <tbody>
              {ramComparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{row.tipo}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{row.velocidad}</td>
                  <td className="px-3 py-2">{row.voltaje}</td>
                  <td className="px-3 py-2 text-xs">{row.canales}</td>
                  <td className="px-3 py-2 text-xs">{row.capacidadMax}</td>
                  <td className="px-3 py-2">{row.precio}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{row.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* DDR4 vs DDR5 */}
      <article className="grid grid-cols-1 my-6">
        <h2 className="text-xl md:text-3xl font-bold text-center mb-2 text-primary uppercase">DDR4 vs DDR5 — Comparación Detallada</h2>
        <div className="flex flex-col md:flex-row items-center rounded-lg p-4 gap-6">
          <Image
            src="https://res.cloudinary.com/dnbrxpca3/image/upload/v1739381195/infografia-memoria-ram-ddr-ddr2-ddr3-ddr4-ddr5_iou9u0.webp"
            alt="Infografía comparativa memorias RAM DDR3 DDR4 DDR5"
            className="w-full md:w-1/2 h-auto mb-4 md:mb-0 rounded-md"
            title="Comparación DDR4 vs DDR5"
            loading="lazy"
            width={600}
            height={400}
          />
          <div className="text-gray-600 text-left">
            <p>✅ <strong>DDR4</strong>:</p>
            <p>- Velocidades entre <strong>2133 y 3200 MHz</strong> (hasta 4800 con OC/XMP)</p>
            <p>- Compatible con Intel 8ª a 12ª gen y AMD Ryzen 1000-5000 (AM4)</p>
            <p>- Más asequible y con amplia disponibilidad de kits</p>
            <p>- Voltaje estándar: 1.2V</p>
            <br />
            <p>✅ <strong>DDR5</strong>:</p>
            <p>- Velocidades desde <strong>4800 hasta 9000+ MHz</strong> con XMP 3.0</p>
            <p>- Requerida para Intel 12ª/13ª/14ª gen (placas DDR5) y AMD AM5 (Ryzen 7000+)</p>
            <p>- Mayor ancho de banda: 2 subcanales de 32 bits por módulo</p>
            <p>- Voltaje estándar: 1.1V (más eficiente que DDR4)</p>
            <br />
            <p>🔎 <strong>¿Cuál elegir?</strong></p>
            <p>Si armás o actualizás una PC con Intel 12ª-14ª gen en plataforma DDR4, o Ryzen 3000-5000 → DDR4 es más económico. Para plataformas nuevas (AM5 o Intel con DDR5) → DDR5 es la única opción y vale la inversión.</p>
          </div>
        </div>
      </article>

      {/* Conceptos técnicos */}
      <article className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🔹 Frecuencia (MHz)</h3>
          <p className="text-sm text-gray-600">
            Indica cuántos ciclos por segundo puede ejecutar la RAM. Mayor MHz = mayor transferencia de datos. DDR4-2400 = 2400 MT/s. DDR5-5600 = 5600 MT/s. <br /><br />
            💡 Para gaming: 3200 MHz DDR4 o 6000 MHz DDR5 son los puntos óptimos precio/rendimiento.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🔹 Latencia CAS (CL)</h3>
          <p className="text-sm text-gray-600">
            El número de ciclos que tarda la RAM en responder. CL16 = 16 ciclos de espera. Menor CL = mejor respuesta. <br /><br />
            Ejemplo: DDR4-3200 CL16 vs DDR4-3200 CL14 → el CL14 es más rápido. En DDR5 las latencias son más altas en número pero la frecuencia compensa. <br /><br />
            💡 Para gaming competitivo: priorizar baja latencia sobre alta frecuencia.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🔹 Capacidad (GB) y Canales</h3>
          <p className="text-sm text-gray-600">
            <strong>8 GB</strong>: mínimo para Windows 11 y navegación.<br />
            <strong>16 GB</strong>: ideal para gaming y multitarea (2x8GB dual channel).<br />
            <strong>32 GB</strong>: edición de video, diseño y gaming exigente.<br />
            <strong>64 GB+</strong>: workstation, virtualización, servidores.<br /><br />
            💡 Siempre instalar en <strong>Dual Channel</strong> (2 módulos iguales) para maximizar el rendimiento.
          </p>
        </div>
      </article>

      <Comparativas />
    </section>
  );
};

export default MemoriaRamPage;
