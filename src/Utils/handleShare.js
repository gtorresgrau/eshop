const handleShare = async (e,product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productUrl = `${window.location.origin}/productos/${product.nombre.replace(/\s+/g, '_')}`;
    const shareData = {
      title: product.nombre,
      text: `Mira este producto: ${product.nombre} - ${product.marca} - ${product.precio ? `Precio: ${product.precio}${product.usd ? 'usd' : 'ar'}` : ''}`,
      url: productUrl
    };
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      // Fallback: Copiar al portapapeles
      try {
        await navigator.clipboard.writeText(productUrl);
        alert('Enlace copiado al portapapeles');
      } catch (error) {
        console.error('Error al copiar el enlace:', error);
      }
    }
  };

  export default handleShare;