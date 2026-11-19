'use client';
import { useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';
import userBank from '../../constants/userBank';
import producto from '../../../../public/images/sinFoto.webp';
import { CartContext } from '../../Context/ShoopingCartContext';
import handleGuardarPedido  from '../../../Utils/handleGuardarPedido';
import handleComprarMercadoPago from '../../../Utils/handleCompraMercadoPago';
import handleGuardarPedidoMercado from '../../../Utils/handleGuardarPedidoMercado';
import FormularioFactura from '../../DashboardCliente/Perfil/FormularioFactura';
import { solicitarEntrega } from '../../../Utils/solicitarEntrega';
import notificador from '../../../Utils/notificador';
import { parsePrecio } from '../../../Utils/parsePrecio';
import { formatearTitulo } from '../../../Utils/formatoTitulo';
import { fotoLiviana } from '../../../Utils/fotoNB';
import { getProductPath } from '../../../Utils/productSlug';
import addToCart from '../../../Utils/addToCart';
import { useFavoritos } from '../../Context/FavoritosContext';

const ENVIO_GRATIS_DESDE = 100000; // mismo umbral que el checkout

const ShopCart = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const { favoritos, esFavorito, alternar } = useFavoritos();

  // Subtotal y total items calculados desde el estado (no del DOM)
  const subtotal = cart.reduce((acc, item) => acc + (parsePrecio(item.precio) * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const formatCurrency = (num) =>
    num.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  const handleComprar = async (descuento = 0) => {
    if (cart.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'El carrito está vacío',
        text: 'Agrega productos al carrito antes de continuar.',
      });
      return;
    }

    if (!isAuthenticated || !user) {
      await Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión para continuar',
        text: 'Debes iniciar sesión para realizar la compra.',
        confirmButtonText: 'Ir a Iniciar sesión'
      });
      router.push('/user/Login');
      return;
    }

    let yaRedirigido = false;

    try {
      setLoading(true);

      // Tipo de factura
      const facturaPrompt = await Swal.fire({
        title: '¿Es consumidor final?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Consumidor Final',
        cancelButtonText: 'Empresa',
        reverseButtons: true,
        allowOutsideClick: true,
      });

      const esConsumidorFinal = facturaPrompt.isConfirmed;
      const tipoFactura = esConsumidorFinal ? 'B' : 'A';

      // Formulario de datos de facturación (renderizado en SweetAlert)
      const datosFactura = await new Promise((resolve) => {
        Swal.fire({
          html: '<div id="form-factura"></div>',
          showConfirmButton: false,
          didOpen: () => {
            const root = document.getElementById('form-factura');
            const container = document.createElement('div');
            root.appendChild(container);
            const rootReact = createRoot(container);
            rootReact.render(
              <FormularioFactura
                tipo={tipoFactura}
                esConsumidorFinal={esConsumidorFinal}
                onSubmit={(data) => resolve(data)}
                onCancel={() => resolve(null)}
              />
            );
          },
          willClose: () => {
            // Opcional: desmontar el root si mantienes referencia
          }
        });
      });

      if (!datosFactura) throw new Error('Debes completar los datos de facturación');

      const userCompleto = {
        ...user,
        factura: {
          ...datosFactura,
          tipo: tipoFactura,
          cuit: datosFactura.cuit || datosFactura.dniOCuit,
        },
      };

      // Selección de tipo de entrega (retiro en local o envío) + teléfono
      const entrega = await solicitarEntrega(datosFactura.telefono || '', { cart });
      if (!entrega) throw new Error('Debes seleccionar cómo recibís tu pedido');

      userCompleto.tipoEntrega = entrega.tipoEntrega;
      userCompleto.nombreCompleto =
        userCompleto.nombreCompleto || userCompleto.displayName || userCompleto.factura?.razonSocial || '';
      userCompleto.dniOCuit =
        userCompleto.dniOCuit || userCompleto.factura?.cuit || userCompleto.documento || '';
      userCompleto.telefono = entrega.telefono || datosFactura.telefono || userCompleto.telefono || '';
      userCompleto.correo = userCompleto.correo || userCompleto.email || '';
      userCompleto.direccionEnvio = entrega.direccion || {
        tipoEntrega: entrega.tipoEntrega,
        telefono: entrega.telefono,
        referencia: entrega.tipoEntrega === 'retiro' ? 'Retiro en local' : 'Envío a coordinar',
      };
      userCompleto.direccion = userCompleto.direccionEnvio;
      // Envío cotizado (solo carritos con productos de New Bytes). El servidor lo vuelve a calcular.
      userCompleto.envio = entrega.envio || null;
      const costoEnvio = Number(entrega.envio?.costoCliente) || 0;

      // Precios por método de pago (el envío se suma al total; el descuento aplica solo a los productos)
      const transferenciaPrecio = subtotal * (1 - (Number(descuento) / 100)) + costoEnvio;
      const mercadoPagoPrecio = subtotal + costoEnvio;

      const result = await Swal.fire({
        title: '¿Cómo deseas pagar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'MercadoPago',
        cancelButtonText: 'Transferencia',
        reverseButtons: true,
        html: `
          <div style="display:flex;justify-content:space-between;font-weight:bold;margin-top:1rem;">
            <span style="color:#15803d;">Transferencia (${descuento}% OFF)</span>
            <span>MercadoPago</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:1.2rem;">
            <span style="color:#15803d;">${formatCurrency(transferenciaPrecio)}</span>
            <span>${formatCurrency(mercadoPagoPrecio)}</span>
          </div>
        `,
      });

      const transferInfo = `
        <h2 class="text-lg font-bold mb-2">Información de Transferencia</h2>
        <p>Por favor, realiza la transferencia a la siguiente cuenta:</p>
        <p><strong>Banco: </strong>${userBank.banco}</p>
        <p>
          <strong>Alias: </strong>
          <span id="aliasTexto">${userBank.alias}</span>
          <button id="btnCopiarAlias" style="margin-left:8px;background:none;border:none;cursor:pointer;" title="Copiar alias" aria-label="Copiar alias">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#F3781B" role="img" aria-hidden="true">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </p>
        <p><strong>CBU: </strong>${userBank.cbu}</p>
        <p><strong>Titular: </strong>${userBank.titular}</p>
        <p><strong>Monto Total: </strong>${formatCurrency(transferenciaPrecio)}</p>
        <p class="mt-4">Una vez realizada la transferencia, por favor envíanos el comprobante a nuestro correo electrónico.</p>
      `;

      if (result.isConfirmed) {
        // MercadoPago
        const compraResponse = await handleComprarMercadoPago(cart, userCompleto);
        if (!compraResponse.ok) throw new Error('Falló la creación de la orden con MercadoPago');

        const compraData = await compraResponse.json();
        if (!compraData.init_point) throw new Error('No se pudo obtener el init_point');

        await handleGuardarPedidoMercado(userCompleto, cart, compraData);
        setCart([]);
        yaRedirigido = true;
        window.location.href = compraData.init_point; // redirección inmediata
        return;
      }

      if (result.dismiss === Swal.DismissReason.cancel) {
        // Transferencia
        const guardarPedidoData = await handleGuardarPedido(userCompleto, cart, Number(descuento) || 0);
        if (!guardarPedidoData?.success) throw new Error(guardarPedidoData?.error || 'No se pudo guardar el pedido');

        await Swal.fire({
          title: 'Transferencia Bancaria',
          icon: 'info',
          html: transferInfo,
          didOpen: () => {
            const btnCopiar = document.getElementById('btnCopiarAlias');
            const aliasTexto = document.getElementById('aliasTexto')?.textContent;
            btnCopiar?.addEventListener('click', () => {
              if (aliasTexto) {
                navigator.clipboard.writeText(aliasTexto.trim())
                  .then(() => Swal.fire({
                    icon: 'success',
                    title: 'Alias copiado',
                    text: `"${aliasTexto.trim()}" fue copiado al portapapeles`,
                    timer: 2000,
                    showConfirmButton: false,
                  }))
                  .catch(() => Swal.fire({
                    icon: 'error',
                    title: 'Error al copiar',
                    text: 'No se pudo copiar el alias',
                    timer: 2000,
                    showConfirmButton: false,
                  }));
              }
            });
          },
        });

        const { isConfirmed: subirAhora } = await Swal.fire({
          title: '¿Quieres subir el comprobante ahora?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, subir comprobante',
          cancelButtonText: 'No, lo haré después',
          reverseButtons: true,
        });

        if (subirAhora) {
          const { value: formValues } = await Swal.fire({
            title: 'Subir Comprobante',
            html: `
              <input type="text" id="nroComprobante" class="swal2-input" placeholder="Número de comprobante" aria-label="Número de comprobante">
              <input type="file" id="comprobante" accept="application/pdf,image/png,image/jpeg" class="swal2-file" aria-label="Archivo de comprobante">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Subir',
            preConfirm: async () => {
              const fileInput = document.getElementById('comprobante');
              const nroInput = document.getElementById('nroComprobante');

              if (!fileInput?.files?.length || !nroInput?.value.trim()) {
                Swal.showValidationMessage('Debes ingresar el número de comprobante y seleccionar un archivo.');
                return;
              }

              const formData = new FormData();
              formData.append('file', fileInput.files[0]);
              formData.append('numeroComprobante', nroInput.value.trim());
              formData.append('pedidoId', guardarPedidoData.orderId);

              try {
                const res = await fetch('/api/pedidos/guardar-ticket', {
                  method: 'POST',
                  body: formData,
                });

                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data?.error || 'Error al subir comprobante');
                return data;
              } catch (err) {
                Swal.showValidationMessage(`Error al subir el comprobante: ${err.message}`);
                return;
              }
            },
          });

          if (formValues?.success) {
            await Swal.fire({
              title: 'Comprobante subido',
              text: 'Tu comprobante fue enviado correctamente.',
              icon: 'success',
            });
          }
        } else {
          await Swal.fire({
            title: 'Comprobante no subido',
            text: 'Puedes subirlo más tarde desde tu perfil.',
            icon: 'info',
          });
        }

        await notificador(guardarPedidoData.orderId);
        setCart([]);
        router.push('/Dashboard');
      }
    } catch (error) {
      console.error('Error en el proceso de compra:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error en la compra',
        text: error.message || 'Ocurrió un error al procesar tu compra',
      });
    } finally {
      setLoading(false);
      // No navegamos aquí: ya se maneja en cada rama.
    }
  };

  const handleFinalizarCompra = async () => {
    // Productos sin precio válido (cargados a mano o de carritos viejos) no se pueden cobrar
    const sinPrecio = cart.filter((item) => parsePrecio(item.precio) <= 0);
    if (sinPrecio.length > 0) {
      const lista = sinPrecio
        .map((item) => `<li style="text-align:left;">${item.nombre} <span style="color:#6b7280;">(${item.cod_producto})</span></li>`)
        .join('');
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: 'Productos sin precio',
        html: `<p style="margin-bottom:12px;font-size:0.92rem;">Estos productos no tienen precio publicado y no se pueden comprar online:</p><ul style="font-size:0.85rem;">${lista}</ul><p style="margin-top:14px;font-size:0.85rem;color:#6b7280;">Podés quitarlos del carrito y volver a finalizar la compra.</p>`,
        showCancelButton: true,
        confirmButtonText: 'Quitarlos del carrito',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });
      if (isConfirmed) setCart((prev) => prev.filter((item) => parsePrecio(item.precio) > 0));
      return;
    }
    const nuevoDescuento = Number(cart[0]?.descuento) || 0; // sin await y seguro
    await handleComprar(nuevoDescuento);
  };

  const handleDecrement = (producto) => {
    setCart((currItems) =>
      currItems.find((item) => item.cod_producto === producto.cod_producto)?.quantity === 1
        ? currItems.filter((item) => item.cod_producto !== producto.cod_producto)
        : currItems.map((item) =>
            item.cod_producto === producto.cod_producto
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
    );
  };

  const handleIncrement = (producto) => {
    setCart((currItems) =>
      currItems.map((item) =>
        item.cod_producto === producto.cod_producto
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleRemove = (producto) => {
    setCart((currItems) => currItems.filter((item) => item.cod_producto !== producto.cod_producto));
  };

  const handleDeleteAll = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de vaciar el carrito?',
      showCancelButton: true,
      confirmButtonText: 'ELIMINAR',
    }).then((result) => {
      if (result.isConfirmed) setCart([]);
    });
  };

  const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';
  const descuento = Number(cart[0]?.descuento) || 0;
  const conTransferencia = subtotal * (1 - descuento / 100);
  const faltaEnvioGratis = Math.max(0, ENVIO_GRATIS_DESDE - subtotal);
  const progreso = Math.min(100, Math.round((subtotal / ENVIO_GRATIS_DESDE) * 100));
  const sugeridos = favoritos.filter((f) => !cart.some((c) => c.cod_producto === f.cod_producto)).slice(0, 4);

  const boton = 'inline-flex h-10 items-center justify-center bg-gray-100 px-3 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900';

  return (
    <section aria-labelledby="carrito-h1" className="w-full bg-white">
      <div className={`${CONT} py-10 lg:py-16`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 id="carrito-h1" className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">
            Tu carrito
          </h1>
          <Link href="/productos" className="text-lg font-semibold text-gray-900 underline underline-offset-4 hover:text-orange-800">
            Seguir comprando
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="mt-12 bg-gray-100 p-8 sm:p-12">
            <p className="text-2xl font-bold text-gray-900">Tu carrito está vacío</p>
            <p className="mt-2 max-w-[48ch] text-lg text-gray-900">Elegí productos del catálogo o revisá los que guardaste en favoritos.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/productos" className="inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2">
                Ver el catálogo
              </Link>
              <Link href="/favoritos" className="inline-flex h-14 items-center bg-white px-8 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900">
                Mis favoritos{favoritos.length > 0 ? ` (${favoritos.length})` : ''}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Productos */}
            <div className="lg:col-span-8">
              <ul>
                {cart.map((item) => {
                  const unit = parsePrecio(item.precio);
                  const esFav = esFavorito(item.cod_producto);
                  return (
                    <li key={item.cod_producto} className="grid grid-cols-[88px_1fr] gap-4 border-t border-gray-300 py-6 sm:grid-cols-[128px_1fr_auto] sm:gap-6">
                      <Link href={getProductPath(item)} className="relative block aspect-square bg-gray-100" aria-hidden="true" tabIndex={-1}>
                        <Image
                          src={fotoLiviana(item.foto_1_1) || producto.src}
                          alt=""
                          fill
                          sizes="128px"
                          className="object-contain p-2 mix-blend-multiply"
                          loading="lazy"
                        />
                      </Link>

                      <div className="min-w-0">
                        {item.marca ? <p className="text-sm text-gray-700">{item.marca}</p> : null}
                        <h2 className="text-lg font-medium leading-snug text-gray-900">
                          <Link href={getProductPath(item)} className="hover:underline">{formatearTitulo(item.nombre)}</Link>
                        </h2>
                        <p className="mt-1 text-sm text-gray-700">Código {item.cod_producto}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                          <div className="inline-flex items-center" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                            <button type="button" onClick={() => handleDecrement(item)} className={`${boton} w-10 text-2xl`} aria-label="Disminuir cantidad" title="Disminuir cantidad">−</button>
                            <span className="inline-flex h-10 min-w-12 items-center justify-center text-lg font-bold tabular-nums text-gray-900" aria-live="polite">{item.quantity}</span>
                            <button type="button" onClick={() => handleIncrement(item)} className={`${boton} w-10 text-2xl`} aria-label="Aumentar cantidad" title="Aumentar cantidad">+</button>
                          </div>
                          <button type="button" onClick={() => alternar(item)} aria-pressed={esFav} className="text-base font-semibold text-gray-900 underline underline-offset-4 hover:text-orange-800">
                            {esFav ? 'En favoritos' : 'Guardar en favoritos'}
                          </button>
                          <button type="button" onClick={() => handleRemove(item)} className="text-base font-semibold text-gray-900 underline underline-offset-4 hover:text-red-700">
                            Quitar
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-left sm:col-span-1 sm:text-right">
                        <p className="text-2xl font-extrabold tabular-nums text-gray-900">{formatCurrency(unit * item.quantity)}</p>
                        {item.quantity > 1 && <p className="text-sm text-gray-700">{formatCurrency(unit)} c/u</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-gray-300 pt-4">
                <button type="button" onClick={handleDeleteAll} className="text-base font-semibold text-gray-900 underline underline-offset-4 hover:text-red-700">
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Resumen */}
            <aside id="resumen" aria-labelledby="resumen-h2" className="self-start bg-gray-100 p-6 sm:p-8 lg:sticky lg:top-28 lg:col-span-4">
              <h2 id="resumen-h2" className="text-2xl font-extrabold text-gray-900">Resumen</h2>

              <dl className="mt-6 space-y-3 text-lg text-gray-900">
                <div className="flex justify-between gap-4">
                  <dt>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</dt>
                  <dd className="font-semibold tabular-nums">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Envío</dt>
                  <dd className="font-semibold">{faltaEnvioGratis === 0 ? 'Gratis' : 'Se cotiza al finalizar'}</dd>
                </div>
              </dl>

              <div className="mt-5">
                {faltaEnvioGratis === 0 ? (
                  <p className="text-base font-semibold text-green-800">Tu compra tiene envío gratis.</p>
                ) : (
                  <p className="text-base text-gray-900">Sumá {formatCurrency(faltaEnvioGratis)} y el envío es gratis.</p>
                )}
                <div className="mt-2 h-2 bg-gray-300" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progreso} aria-label="Avance hacia el envío gratis">
                  <div className="h-full bg-green-700" style={{ width: `${progreso}%` }} />
                </div>
              </div>

              <div className="mt-6 border-t border-gray-300 pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-lg font-semibold text-gray-900">Subtotal</span>
                  <span className="text-3xl font-extrabold tabular-nums text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {descuento > 0 && (
                  <p className="mt-2 text-base font-semibold text-green-800">
                    Pagando por transferencia: {formatCurrency(conTransferencia)} ({descuento}% OFF)
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleFinalizarCompra}
                disabled={loading}
                className="mt-6 inline-flex h-14 w-full items-center justify-center bg-orange-700 px-6 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 disabled:opacity-60"
                title="Finalizar compra"
                aria-label="Finalizar compra"
              >
                {loading ? <Loading /> : 'Finalizar compra'}
              </button>
              <p className="mt-3 text-sm text-gray-700">El método de pago y el envío los elegís en el siguiente paso.</p>
            </aside>
          </div>
        )}

        {/* Favoritos que todavía no están en el carrito */}
        {sugeridos.length > 0 && (
          <div className="mt-16 border-t border-gray-300 pt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-gray-900">De tus favoritos</h2>
              <Link href="/favoritos" className="text-base font-semibold text-gray-900 underline underline-offset-4 hover:text-orange-800">Ver todos</Link>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {sugeridos.map((p) => (
                <li key={p.cod_producto}>
                  <Link href={getProductPath(p)} className="relative block aspect-square bg-gray-100">
                    <Image src={fotoLiviana(p.foto_1_1) || producto.src} alt="" fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-contain p-3 mix-blend-multiply" loading="lazy" />
                  </Link>
                  <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-base font-medium leading-snug text-gray-900">{formatearTitulo(p.nombre)}</p>
                  <p className="text-lg font-extrabold tabular-nums text-gray-900">{formatCurrency(parsePrecio(p.precio))}</p>
                  <button type="button" onClick={() => addToCart(p, cart, setCart)} className="mt-2 inline-flex h-11 w-full items-center justify-center bg-gray-900 px-3 text-base font-semibold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                    Agregar al carrito
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopCart;
