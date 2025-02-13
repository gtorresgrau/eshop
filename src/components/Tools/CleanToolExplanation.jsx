'use client';
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { scriptCode } from '@/app/constants/infoWeb';

const CleanToolExplanation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansion = () => setIsExpanded(!isExpanded);

  // Calculate the length to show a quarter of the content
  const previewLength = Math.ceil(scriptCode.length / 4);
  const previewContent = scriptCode.slice(0, previewLength);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center align-middle">
        <div className="flex text-center justify-center justify-items-center items-end">
          <img
            src="/icons/CleanTool.webp"
            title="CleanTool Icon"
            aria-label="CleanTool Icon"
            alt="CleanTool Icon"
            className="w-14"
          />
          <h2 className="text-3xl md:text-4xl text-center font-extrabold text-primary uppercase">
            Sistema de Limpieza de PC
          </h2>
        </div>
        <p className="text-lg text-gray-600 mt-2">
          Creado por{' '}
          <a
            href="https://gonzalotorresgrau.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            title="Visitar el sitio web de Gonzalo Torres Grau"
            aria-label="Visitar el sitio web de Gonzalo Torres Grau"
          >
            Gonzalo Torres Grau
          </a>
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-8 shadow">
        <pre
          className={`overflow-x-auto text-sm text-gray-700 ${
            isExpanded ? 'max-h-full' : 'max-h-40'
          } transition-max-height duration-300 ease-in-out`}
        >
          <code>{isExpanded ? scriptCode : `${previewContent}...`}</code>
        </pre>
        <button
          onClick={toggleExpansion}
          className="mt-2 text-blue-500 hover:underline focus:outline-none"
          title={isExpanded ? 'Ver menos contenido del script' : 'Ver más contenido del script'}
          aria-label={isExpanded ? 'Ver menos contenido del script' : 'Ver más contenido del script'}
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="flex flex-row gap-1">
          <a
            href="/docs/CleanTool_v2.0.exe"
            download
            className="bg-green-500 flex flex-row text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
            title="Descargar CleanTool v2.0"
            aria-label="Descargar CleanTool v2.0"
          >
            <Download className="mx-1" aria-hidden="true" />
            Descargar
          </a>
        </div>
        <a
          href="https://gonzalotorresgrau.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          title="Visitar el sitio web de Gonzalo Torres Grau"
          aria-label="Visitar el sitio web de Gonzalo Torres Grau"
        >
          Visitar mi web
        </a>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">¿Cómo funciona?</h2>
        <p className="text-gray-700 leading-relaxed">
          Este script de PowerShell automatiza la limpieza de tu PC. Realiza tareas como:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>
            Mostrar un banner ASCII y detectar el idioma del sistema para mostrar mensajes localizados.
          </li>
          <li>
            Eliminar archivos temporales, limpiar la papelera de reciclaje y vaciar carpetas específicas.
          </li>
          <li>
            Ejecutar la herramienta de limpieza de disco y borrar caches de navegadores.
          </li>
          <li>
            Proporcionar feedback visual al usuario mediante mensajes en la consola.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CleanToolExplanation;
