'use client'
import React from 'react';

const Ubicacion = () => {
    return (
        <section id="ubicacion" className="mx-auto max-w-2xl py-10 px-4 lg:max-w-7xl lg:px-8">
            <article className='flex flex-col items-center justify-center py-2 m-2 w-full'>
                <h2 className="mb-4 text-3xl md:text-4xl text-center md:text-start tracking-tight font-extrabold text-text-primary-title">¿Dónde nos encontras?</h2>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.031780329225!2d-57.58253912493915!3d-37.97638764334836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584d92be5d015f5%3A0xc9cd74c99a4cf05d!2sCENTRALCAM!5e0!3m2!1ses-419!2sar!4v1736360777775!5m2!1ses-419!2sar"
                    height="450"
                    allowFullScreen={true}
                    className='w-full pr-4'
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title='Ubicacion de Local'
                ></iframe>
            </article>
        </section>
    );
};

export default Ubicacion;
