import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { fuenteOptions, fuenteComparison } from '../../constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const FuentePage = () => {
  return (
    <section className="container mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-2 uppercase text-primary" title="Comparación de Fuentes de Poder">
        Comparación de Fuentes de Alimentación
      </h1>
      <p className="text-center text-gray-500 mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Certificaciones 80 PLUS, wattaje, modularidad y protecciones. Elegí la fuente correcta para tu PC según el consumo de tus componentes.
      </p>

      {/* Cards */}
      <article className="grid md:grid-cols-3 gap-6 mb-10">
        {fuenteOptions.map((option, index) => (
          <div key={index} className="items-center justify-center flex flex-col border rounded-lg p-4 shadow-lg text-center hover:shadow-xl hover:scale-105 hover:shadow-blue-200 transition-all">
            <Image
              src={option.img}
              alt={option.alt}
              className="w-1/2 h-auto object-cover mb-4 rounded-md"
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

      {/* Tabla comparativa certificaciones */}
      <article className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary uppercase">
          Tabla de Certificaciones 80 PLUS
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-3">Certificación</th>
                <th className="px-3 py-3">Eficiencia al 50%</th>
                <th className="px-3 py-3">Calidad</th>
                <th className="px-3 py-3">Modular</th>
                <th className="px-3 py-3">Recomendado para</th>
              </tr>
            </thead>
            <tbody>
              {fuenteComparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{row.certificacion}</td>
                  <td className="px-3 py-2 text-blue-700 font-semibold">{row.eficiencia50}</td>
                  <td className="px-3 py-2">{row.calidad}</td>
                  <td className="px-3 py-2">{row.modular}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{row.recomendado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">💡 La eficiencia al 50% de carga es la más representativa del uso real de una PC de escritorio.</p>
      </article>

      {/* Imagen + texto */}
      <article className="grid grid-cols-1 my-6">
        <h2 className="text-xl md:text-3xl font-bold text-center mb-2 text-primary uppercase">
          ¿Cuántos Watts necesita mi PC?
        </h2>
        <div className="flex flex-col md:flex-row items-center rounded-lg p-4 gap-6">
          <Image
            src="https://res.cloudinary.com/dnbrxpca3/image/upload/v1739456111/comparativa_de_fuentes_fnpewn.webp"
            alt="Guía de wattaje para fuentes de alimentación PC"
            className="w-full md:w-1/2 mb-4 md:mb-0 rounded-md"
            title="Cuántos watts necesita tu PC"
            loading="lazy"
            width={600}
            height={400}
          />
          <div className="text-gray-600 text-left">
            <p>🔹 <strong>Potencia (Watts — W)</strong></p>
            <p>Calculá la potencia sumando el TDP de CPU + GPU + resto de componentes y añadí un 20-30% de margen.</p>
            <br />
            <p>📌 <strong>Guía por tipo de PC:</strong></p>
            <p>💼 <strong>PC de oficina / HTPC</strong>: 300-400W (Bronze suficiente)</p>
            <p>🎮 <strong>Gaming básico (GTX 1660 / RX 6600)</strong>: 550-650W Gold</p>
            <p>🎮 <strong>Gaming medio (RTX 3070 / RX 6700 XT)</strong>: 650-750W Gold</p>
            <p>🔥 <strong>Gaming alto (RTX 4080 / RX 7900 XT)</strong>: 850-1000W Gold/Platinum</p>
            <p>🖥️ <strong>Workstation / Doble GPU</strong>: 1000-1600W Platinum/Titanium</p>
            <br />
            <p>💡 <strong>Tip</strong>: Una fuente sobredimensionada no consume más electricidad — opera en su rango óptimo de eficiencia y dura más.</p>
          </div>
        </div>
      </article>

      {/* Protecciones y modularidad */}
      <article className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded-lg p-5 shadow">
          <h3 className="font-bold text-primary mb-3 text-lg">🛡️ Protecciones de Seguridad</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ <strong>OCP</strong> — Protección contra sobrecorriente</li>
            <li>✅ <strong>OVP</strong> — Protección contra sobrevoltaje</li>
            <li>✅ <strong>UVP</strong> — Protección contra bajo voltaje</li>
            <li>✅ <strong>SCP</strong> — Protección contra cortocircuitos</li>
            <li>✅ <strong>OTP</strong> — Protección contra sobretemperatura</li>
            <li>✅ <strong>OPP</strong> — Protección contra sobrepotencia</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">Una buena fuente con protecciones completas puede salvar tus componentes ante una falla eléctrica.</p>
        </div>
        <div className="border rounded-lg p-5 shadow">
          <h3 className="font-bold text-primary mb-3 text-lg">🔌 Tipos de Modularidad</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><strong>No modular</strong>: Todos los cables fijos. Más económicas, más desorden de cables.</li>
            <li><strong>Semi-modular</strong>: Cables principales fijos (ATX 24-pin, EPS CPU). Periféricos removibles. Balance entre precio y organización.</li>
            <li><strong>Full modular</strong>: Todos los cables removibles. Máxima organización, ideal para builds premium o transparentes.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">💡 En builds con buena visibilidad (vidrio templado) conviene semi o full modular para mejor cable management.</p>
        </div>
      </article>

      <Comparativas />
    </section>
  );
};

export default FuentePage;
