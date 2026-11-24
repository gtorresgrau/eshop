import GuiaTecnica from './GuiaTecnica';

const ServidoresPage = () => (
  <GuiaTecnica
    titulo="Comparativa de Servidores: Torre, Rack y Blade"
    intro="Formatos, procesadores, memoria ECC, discos y RAID. Qué servidor necesita tu empresa según la cantidad de usuarios, las aplicaciones y la virtualización."
    opciones={[
      { emoji: '🟢', title: 'Servidor torre', description: 'Parece una PC grande. Silencioso, económico y no necesita rack. Ideal para pymes.' },
      { emoji: '🔵', title: 'Servidor rack 1U / 2U', description: 'Se monta en rack de 19 pulgadas. Más densidad y expansión. El formato más usado en empresas.' },
      { emoji: '🟣', title: 'Servidor rack 4U', description: 'Mucho espacio para discos, GPU y tarjetas. Para almacenamiento y cómputo pesado.' },
      { emoji: '🔴', title: 'Blade / hiperconvergente', description: 'Varios servidores en un chasis compartido. Para datacenters y nubes privadas.' },
    ]}
    tablaTitulo="Tabla comparativa de formatos de servidor"
    columnas={['Formato', 'Procesadores', 'Memoria máx.', 'Discos', 'Fuentes', 'Ruido', 'Uso ideal']}
    filas={[
      ['Torre', '1 CPU', 'Hasta 128 GB - 1 TB', '4 a 8 bahías', '1 o 2 (redundante opcional)', 'Bajo', 'Pyme, archivos, ERP, oficina sin rack'],
      ['Rack 1U', '1 o 2 CPU', 'Hasta 1 TB - 4 TB', '4 a 10 bahías 2.5"', '2 redundantes', 'Alto', 'Virtualización liviana, web, aplicaciones'],
      ['Rack 2U', '1 o 2 CPU', 'Hasta 2 TB - 8 TB', '8 a 26 bahías', '2 redundantes', 'Alto', 'Virtualización, bases de datos, almacenamiento'],
      ['Rack 4U', '2 CPU', 'Hasta 8 TB', '24 a 60 bahías o GPU', '2 a 4 redundantes', 'Muy alto', 'Almacenamiento masivo, IA, renderizado'],
      ['Blade', '2 CPU por lámina', 'Según lámina', 'Almacenamiento compartido', 'En el chasis', 'Muy alto', 'Datacenter, alta densidad'],
    ]}
    conceptos={[
      { title: '🧠 Procesador y memoria ECC', text: 'Los servidores usan CPUs como Intel Xeon o AMD EPYC (más núcleos, más canales de memoria y más carriles PCIe que una PC). La memoria ECC detecta y corrige errores en tiempo real, evita cuelgues y es fundamental en bases de datos y virtualización.' },
      { title: '💾 Discos y RAID', text: 'RAID 1 duplica los discos, RAID 5 tolera la falla de 1 disco, RAID 6 la de 2 y RAID 10 combina velocidad y protección. Para bases de datos conviene SSD SAS o NVMe; para archivos y copias de respaldo, HDD de gran capacidad. Y recordá que RAID no reemplaza al backup.' },
      { title: '🛠️ Gestión remota y garantía', text: 'Una controladora de gestión remota (iDRAC, iLO, IPMI) permite encender, reiniciar y reparar el servidor sin estar presente. Sumá fuentes y ventiladores redundantes, discos hot-swap y una garantía con atención en el sitio: la parada de un servidor cuesta más que el equipo.' },
    ]}
    eleccionTitulo="🎯 ¿Cuál elegir según tu uso?"
    elecciones={[
      ['🗂️ Archivos y gestión (hasta 25 usuarios)', 'servidor torre con 1 CPU, 32 GB ECC y RAID 1.'],
      ['🏢 Pyme con varias aplicaciones', 'rack 1U o 2U con 64 a 128 GB ECC y RAID 5 o 10.'],
      ['🖥️ Virtualización (VMware, Proxmox, Hyper-V)', 'rack 2U con 2 CPU, 256 GB o más y discos NVMe o SSD.'],
      ['🗄️ Base de datos', 'SSD NVMe en RAID 10, memoria ECC abundante y fuentes redundantes.'],
      ['📼 Respaldo y almacenamiento', 'rack 2U o 4U con muchas bahías de HDD en RAID 6.'],
      ['🤖 IA y renderizado', 'rack 4U con soporte para varias GPU y fuentes de alta potencia.'],
    ]}
  />
);

export default ServidoresPage;
