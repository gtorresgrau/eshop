import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motherOptions } from '@/components/constants/infoWeb';
const Comparativas = dynamic(() => import('../Comparativas'));

const MothersPage = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6" title='Comparación de Placas Madre Intel y AMD'>Comparación de Placas Madre Intel y AMD</h1>
      <article className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {motherOptions.map((option, index) => (
          <div key={index} className="flex flex-col place-items-center border rounded-lg p-4 shadow-lg text-center hover:shadow-xl hover:scale-105 hover:shadow-blue-200 hover:transition-all justify-center">
            <Image 
              src={option.img} 
              alt={option.alt} 
              className="h-auto object-cover mb-4 rounded-md justify-center"
              title={option.alt} 
              aria-label={`Imagen de ${option.title}`}
              loading='lazy'
              width={200}
              height={200}
            />
            <h2 className="text-xl font-semibold mb-2" title={option.title}>{option.title}</h2>
            <p className="text-gray-600">{option.description}</p>
          </div>
        ))}
      </article>
      <article className="grid grid-cols-1 my-6">
        <h2 className="text-3xl font-bold text-center mb-2" title="Comparación Intel vs AMD">Comparación Intel vs AMD</h2>
        <div className="flex flex-col md:flex-row items-center rounded-lg p-4 text-center">
          <Image 
            src="https://res.cloudinary.com/dnbrxpca3/image/upload/v1740671396/comparaticaMothers_myzqoa.webp" 
            alt="Comparación de Placas Madre Intel y AMD" 
            className="w-1/2 h-auto mb-4 md:mb-0 md:mr-6 rounded-md" 
            title="Comparación de Placas Madre Intel y AMD" 
            aria-label="Imagen de comparación de Placas Madre Intel y AMD" 
            loading='lazy' 
            width={600} 
            height={400} 
          />
          <p className="text-gray-600 text-left">
            Las placas madre para procesadores <strong>Intel</strong> y <strong>AMD</strong> tienen diferencias clave en compatibilidad, rendimiento y precio.  
            <br /><br />
            ✅ <strong>Intel</strong>:  
            <br />- Mayor compatibilidad con tecnologías exclusivas como Thunderbolt y Optane.  
            <br />- Soporte para más generaciones de procesadores en ciertos modelos.  
            <br />- Generalmente mejor rendimiento en tareas de un solo núcleo.  
            <br /><br />
            ✅ <strong>AMD</strong>:  
            <br />- Mayor compatibilidad entre generaciones de procesadores.  
            <br />- Más núcleos e hilos en modelos de gama media y alta.  
            <br />- Generalmente mejor relación calidad-precio en multitarea y gaming.  
            <br /><br />
            🔎 <strong>¿Cuál elegir?</strong>  
            <br />Si buscas estabilidad y compatibilidad con las últimas tecnologías, Intel es ideal. Para un mejor rendimiento en multitarea y gaming, AMD es la mejor opción.
          </p>
        </div>
      </article>
      <Comparativas />
    </section>
  );
};

export default MothersPage;
