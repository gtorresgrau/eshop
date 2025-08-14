const fetchProduct= async(nombre) => {
  try {
    if (!nombre) return null;
    const base = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
    const url = `${base}/api/productos/${encodeURIComponent(String(nombre))}`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return null;
  }
}

export default fetchProduct;