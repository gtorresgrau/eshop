// Los nombres de producto de New Bytes vienen TODO EN MAYÚSCULAS. Para mostrarlos legibles se pasan a
// "Tipo título", conservando siglas, modelos (con números) y palabras ya escritas en mayúsculas y minúsculas.
// Solo cambia lo que se ve: el dato guardado no se toca.

const SIGLAS = new Set([
  'USB', 'HDMI', 'RGB', 'LED', 'SSD', 'HDD', 'LCD', 'OLED', 'UPS', 'CPU', 'GPU', 'RAM', 'DDR', 'NVME', 'SATA',
  'LAN', 'VGA', 'DVI', 'ATX', 'MATX', 'ITX', 'PCIE', 'USB-C', 'RJ45', 'CCTV', 'NAS', 'DVR', 'NVR', 'IP', 'TV', 'PC',
  'MAC', 'RAID', 'LTE', 'GSM', 'SIM', 'ARGB', 'AIO', 'PSU', 'EATX', 'SFF', 'OTG', 'FHD', 'UHD', 'QHD', 'HD', 'TB', 'GB', 'MB',
]);
SIGLAS.add('AMD'); SIGLAS.add('MSI'); SIGLAS.add('RTX'); SIGLAS.add('GTX'); SIGLAS.add('TUF'); SIGLAS.add('ROG'); SIGLAS.add('GPS'); SIGLAS.add('NFC');
const PALABRAS_CORTAS = new Set(['Y', 'DE', 'CON', 'SIN', 'POR', 'EN', 'LA', 'EL', 'LOS', 'LAS', 'UN', 'UNA', 'DEL', 'AL', 'O', 'E', 'A', 'PARA']);
const ESPECIALES ={ WIFI: 'WiFi', BLUETOOTH: 'Bluetooth', POE: 'PoE', GAMER: 'Gamer' };

const esMayuscula = (s) => s === s.toUpperCase() && s !== s.toLowerCase();

export function formatearTitulo(texto = '') {
  const t = String(texto).trim();
  const letras = t.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g, '');
  if (letras.length < 6) return t;
  const mayus = t.replace(/[^A-ZÁÉÍÓÚÑÜ]/g, '').length;
  if (mayus / letras.length < 0.7) return t; // ya viene en mayúsculas y minúsculas

  return t.replace(/[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9.]+/g, (w, offset) => {
    if (/\d/.test(w)) return w; // modelos: GR500, DAP-2610, AC1300
    if (!esMayuscula(w)) return w; // PoE, iPhone…
    const up = w.toUpperCase();
    if (ESPECIALES[up]) return ESPECIALES[up];
    if (SIGLAS.has(up)) return w;
    if (PALABRAS_CORTAS.has(up) && offset > 0) return w.toLowerCase(); // y, de, con, para…
    // Hasta 3 letras suelen ser siglas o modelos (DAP, XL, HP, LG): se conservan, salvo palabras comunes
    if (w.length <= 3 && !PALABRAS_COMUNES_3.has(up)) return w;
    return w.charAt(0) + w.slice(1).toLowerCase();
  });
}
