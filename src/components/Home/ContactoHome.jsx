'use client';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Reveal from './Reveal';
import userData from '../constants/userData';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';
const campo =
  'w-full bg-white px-5 text-base text-gray-900 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900';

/**
 * Contacto: los datos reales a la izquierda y el formulario (/api/contact) a la derecha.
 * Los campos son planos, de fondo blanco sobre el campo gris.
 */
export default function ContactoHome() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' });
  const [resultado, setResultado] = useState(null); // null | { ok, texto }
  const inicio = useRef(Date.now()); // para el control anti-bots: tiempo que tardó en completarse

  const wa = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(userData.textoPredefinido)}`;

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, t: Date.now() - inicio.current }) });
      if (res.status === 200) {
        setResultado({ ok: true, texto: 'Recibimos tu mensaje. Te respondemos por correo lo antes posible.' });
        reset();
      } else if (res.status === 429) {
        setResultado({ ok: false, texto: 'Enviaste muchos mensajes seguidos. Probá de nuevo más tarde o escribinos por WhatsApp.' });
      } else {
        setResultado({ ok: false, texto: 'No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.' });
      }
    } catch {
      setResultado({ ok: false, texto: 'No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.' });
    }
  };

  return (
    <section id="contacto" aria-labelledby="contacto-h2" className="bg-gray-100 py-20 lg:py-32">
      <div className={`${CONT} grid gap-14 lg:grid-cols-2 lg:gap-24`}>
        <Reveal>
          <h2 id="contacto-h2" className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Escribinos
          </h2>
          <p className="mt-6 max-w-[44ch] text-xl leading-relaxed text-gray-900">
            Completá el formulario, mandá un correo o escribinos por WhatsApp: lo que te quede más cómodo.
          </p>
          <dl className="mt-10 space-y-6 text-xl text-gray-900">
            <div>
              <dt className="text-base text-gray-700">Dirección</dt>
              <dd className="font-semibold">{userData.direccion}</dd>
            </div>
            <div>
              <dt className="text-base text-gray-700">Correo</dt>
              <dd className="font-semibold"><a href={`mailto:${userData.email}`} className="underline-offset-2 hover:underline">{userData.email}</a></dd>
            </div>
            <div>
              <dt className="text-base text-gray-700">Teléfono</dt>
              <dd className="font-semibold"><a href={`tel:+${userData.codigoPais}${userData.contact}`} className="underline-offset-2 hover:underline">+{userData.codigoPais} {userData.contact}</a></dd>
            </div>
          </dl>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
          >
            Escribir por WhatsApp
          </a>
        </Reveal>

        <Reveal delay={100}>
          {resultado?.ok ? (
            <div role="status" className="bg-white p-8">
              <h3 className="text-2xl font-bold text-gray-900">¡Listo!</h3>
              <p className="mt-2 text-lg text-gray-900">{resultado.texto}</p>
              <button type="button" onClick={() => setResultado(null)} className="mt-6 h-12 bg-gray-900 px-6 text-base font-semibold text-white hover:bg-black">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <input type="hidden" value="Consulta" {...register('subject')} />
              <input type="hidden" value="Enviado desde la WEB" {...register('from_name')} />
              {/* Trampa para bots: fuera de pantalla, una persona no la ve ni la completa */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="c-web">No completar este campo</label>
                <input id="c-web" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              <div>
                <label htmlFor="c-nombre" className="mb-1 block text-base font-medium text-gray-900">Nombre</label>
                <input id="c-nombre" type="text" autoComplete="name" className={`${campo} h-14`} aria-invalid={!!errors.name}
                  {...register('name', { required: 'Ingresá tu nombre', maxLength: 80 })} />
                {errors.name && <p className="mt-1 text-base font-medium text-red-700">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="c-email" className="mb-1 block text-base font-medium text-gray-900">Correo electrónico</label>
                <input id="c-email" type="email" autoComplete="email" className={`${campo} h-14`} aria-invalid={!!errors.email}
                  {...register('email', { required: 'Ingresá tu correo', pattern: { value: /^\S+@\S+$/i, message: 'Ingresá un correo válido' } })} />
                {errors.email && <p className="mt-1 text-base font-medium text-red-700">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="c-msg" className="mb-1 block text-base font-medium text-gray-900">Mensaje</label>
                <textarea id="c-msg" rows={5} className={`${campo} resize-y py-4`} aria-invalid={!!errors.message}
                  {...register('message', { required: 'Escribí tu mensaje' })} />
                {errors.message && <p className="mt-1 text-base font-medium text-red-700">{errors.message.message}</p>}
              </div>

              {resultado && !resultado.ok && <p role="alert" className="text-base font-semibold text-red-700">{resultado.texto}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full bg-gray-900 text-lg font-semibold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
