import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { storageOptions, storageComparison } from '../../constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const AlmacenamientoPage = () => {
  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title="Comparación de Dispositivos de Almacenamiento">
        Comparación de Almacenamiento: HDD vs SSD
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Guía completa para elegir entre disco rígido mecánico (HDD) y unidad de estado sólido (SSD) según tu presupuesto y necesidades.
      </p>

      {/* Cards de tipos */}
      <article className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {storageOptions.map((option, index) => (
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

      {/* Tabla comparativa velocidades */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary uppercase">
          Tabla Comparativa de Velocidades y Precios
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Tipo</th>
                <th className="px-3 py-3">Lectura</th>
                <th className="px-3 py-3">Escritura</th>
                <th className="px-3 py-3">Interfaz</th>
                <th className="px-3 py-3">Cap. máx.</th>
                <th className="px-3 py-3">Precio</th>
                <th className="px-3 py-3">Uso ideal</th>
              </tr>
            </thead>
            <tbody>
              {storageComparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{row.tipo}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{row.lectura}</td>
                  <td className="px-3 py-2 text-green-700 font-semibold">{row.escritura}</td>
                  <td className="px-3 py-2 text-xs">{row.interfaz}</td>
                  <td className="px-3 py-2 text-xs">{row.capacidadMax}</td>
                  <td className="px-3 py-2">{row.precio}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{row.usoIdeal || row.uso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">💡 Las velocidades son aproximadas. Varían según marca, modelo y temperatura de operación.</p>
      </article>

      {/* SSD M.2 SATA vs NVMe */}
      <article className="grid grid-cols-1 my-6">
        <h2 className="text-xl md:text-3xl font-bold text-center mb-2 text-primary uppercase" title="Comparación de Dispositivos de Almacenamiento">
          Comparación: SSD M.2 SATA vs M.2 NVMe
        </h2>
        <div className="flex flex-col md:flex-row items-center rounded-lg p-4 text-center gap-6">
          <Image
            src="https://res.cloudinary.com/dnbrxpca3/image/upload/v1739372328/Almacenamiento_M.2_comparativa_krya8x.webp"
            alt="Comparación de discos SSD M.2 SATA y M.2 NVMe"
            className="w-full md:w-1/2 mb-4 md:mb-0 rounded-md"
            title="Comparación de discos SSD M.2 SATA y M.2 NVMe"
            aria-label="Imagen de comparación de discos SSD M.2 SATA y M.2 NVMe"
            loading="lazy"
            width={400}
            height={100}
          />
          <div className="text-gray-600 text-left">
            <p>
              Los SSD M.2 SATA y M.2 NVMe comparten el mismo conector físico M.2 pero utilizan protocolos completamente distintos, lo que genera diferencias enormes en rendimiento.
            </p>
            <br />
            <p>✅ <strong>SSD M.2 SATA</strong>:</p>
            <p>- Utiliza la interfaz SATA, con una velocidad máxima de <strong>550 MB/s</strong>.</p>
            <p>- Más económico y compatible con la mayoría de placas con ranura M.2 (Key B+M).</p>
            <p>- Ideal para actualizar laptops o PCs con presupuesto ajustado.</p>
            <br />
            <p>✅ <strong>SSD M.2 NVMe</strong>:</p>
            <p>- Utiliza la interfaz PCIe y el protocolo NVMe, con velocidades de hasta <strong>14.000 MB/s</strong> en Gen5.</p>
            <p>- Tiempos de carga significativamente menores en juegos, edición de video y compilación.</p>
            <p>- Requiere soporte NVMe en la placa base (ranura M.2 Key M).</p>
            <br />
            <p>🔎 <strong>¿Cuál elegir?</strong></p>
            <p>Para uso cotidiano o laptops económicas: M.2 SATA está perfecto. Para gaming, edición 4K o workstations exigentes: NVMe Gen4 o Gen5 marca una diferencia real y medible.</p>
          </div>
        </div>
      </article>

      {/* Conceptos clave */}
      <article className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🔢 IOPS — Operaciones por Segundo</h3>
          <p className="text-sm text-gray-600">
            Las IOPS miden cuántas operaciones de lectura/escritura pequeñas puede hacer el disco por segundo. Crítico para sistemas operativos y bases de datos. Un HDD tiene ~100-200 IOPS, un SSD NVMe supera 1.000.000 IOPS.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">📦 Vida útil — TBW</h3>
          <p className="text-sm text-gray-600">
            Los SSDs tienen un límite de escritura medido en <strong>TBW (Terabytes Written)</strong>. Un SSD de 1 TB típico tiene 300-600 TBW, suficiente para muchos años de uso normal. Los HDD no tienen este límite pero sí fallan mecánicamente.
          </p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-primary mb-2">🌡️ Calor y DRAM Cache</h3>
          <p className="text-sm text-gray-600">
            Los SSDs NVMe Gen4/5 generan calor y algunos requieren disipador. Los modelos con <strong>DRAM cache</strong> son más rápidos y confiables que los DRAM-less, especialmente en escrituras sostenidas largas.
          </p>
        </div>
      </article>

      <Comparativas />
    </section>
  );
};

export default AlmacenamientoPage;
