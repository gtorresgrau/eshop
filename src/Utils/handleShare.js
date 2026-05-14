/**
 * Muestra un toast temporal en pantalla para confirmar acciones de compartir/copiar.
 */
const showToast = (message, type = 'success') => {
  const existing = document.getElementById('share-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'share-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#22c55e' : '#ef4444'};
    color: white; padding: 10px 20px; border-radius: 8px;
    font-size: 14px; font-weight: 600; z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: fadeInUp 0.3s ease;
  `;
  // Animación simple
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeInUp { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

/**
 * Construye la URL pública de un producto de forma segura.
 */
export const getProductUrl = (product) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const slug = product.nombre
    .trim()
    .replace(/\s+/g, '_');
  return `${origin}/productos/${slug}`;
};

const handleShare = async (arg1, arg2) => {
  if (arg1 instanceof File) {
    // Caso: compartir un archivo (ej: PDF de presupuesto)
    const file = arg1;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Presupuesto',
          text: 'Te envío el presupuesto en PDF',
          files: [file],
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error al compartir archivo:', error);
        }
      }
    } else {
      // Fallback: descargar el archivo
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      showToast('El PDF fue descargado');
    }
  } else {
    // Caso: compartir producto
    const e = arg1;
    const product = arg2;

    e.preventDefault();
    e.stopPropagation();

    const productUrl = getProductUrl(product);
    const precioText = product.precio
      ? ` | Precio: $${Number(product.precio).toLocaleString('es-AR')}${product.usd ? ' USD' : ''}`
      : '';
    const shareData = {
      title: product.titulo_de_producto || product.nombre,
      text: `${product.nombre} - ${product.marca}${precioText}`,
      url: productUrl,
    };

    // Intentar compartir nativo (móvil/desktop compatible)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Si falla, fallback a clipboard
          await copyToClipboard(productUrl);
        }
      }
    } else {
      await copyToClipboard(productUrl);
    }
  }
};

const copyToClipboard = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    showToast('✓ Enlace copiado al portapapeles');
  } catch {
    // Fallback manual para navegadores sin clipboard API
    const input = document.createElement('input');
    input.value = url;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('✓ Enlace copiado al portapapeles');
  }
};

export default handleShare;
