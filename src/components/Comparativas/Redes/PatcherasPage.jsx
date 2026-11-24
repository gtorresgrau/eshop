import GuiaTecnica from './GuiaTecnica';

const PatcherasPage = () => (
  <GuiaTecnica
    titulo="Comparativa de Patcheras y Cableado Estructurado"
    intro="Patch panels de 12, 24 y 48 puertos, categorías Cat5e, Cat6 y Cat6A, blindaje y fibra óptica. Cómo armar un rack prolijo y preparado para crecer."
    opciones={[
      { emoji: '🟢', title: 'Patchera Cat5e', description: 'Hasta 1 Gbps y 100 MHz. Alcanza para oficinas básicas y cableado existente.' },
      { emoji: '🔵', title: 'Patchera Cat6', description: 'Hasta 250 MHz. Gigabit estable y 10G en tramos cortos. El estándar actual para instalaciones nuevas.' },
      { emoji: '🟣', title: 'Patchera Cat6A', description: '500 MHz y 10 Gbps hasta 100 m. Para redes con Wi-Fi 6/7, servidores y cámaras.' },
      { emoji: '🔴', title: 'Fibra óptica (ODF)', description: 'Distribuidor óptico con conectores LC o SC. Para enlaces entre pisos, edificios o largas distancias.' },
    ]}
    tablaTitulo="Tabla comparativa de categorías de cableado"
    columnas={['Categoría', 'Frecuencia', 'Velocidad máxima', 'Distancia', 'Blindaje', 'Uso ideal']}
    filas={[
      ['Cat5e', '100 MHz', '1 Gbps', '100 m', 'UTP', 'Oficinas básicas, cableado existente'],
      ['Cat6', '250 MHz', '1 Gbps (10 Gbps hasta 55 m)', '100 m (55 m a 10G)', 'UTP o FTP', 'Instalaciones nuevas, cámaras IP, VoIP'],
      ['Cat6A', '500 MHz', '10 Gbps', '100 m', 'FTP / STP', 'Wi-Fi 6/7, servidores, entornos con interferencia'],
      ['Cat8', '2000 MHz', '25 / 40 Gbps', '30 m', 'S/FTP', 'Datacenter, enlaces cortos entre switches y servidores'],
      ['Fibra multimodo OM3/OM4', 'No aplica', '10 Gbps hasta 300-400 m', '300-400 m a 10G', 'No aplica', 'Enlaces entre pisos o edificios'],
      ['Fibra monomodo OS2', 'No aplica', '10 Gbps y más', 'Varios km', 'No aplica', 'Largas distancias, backbone'],
    ]}
    conceptos={[
      { title: '🗄️ Formato y cantidad de puertos', text: 'Las patcheras de 12, 24 y 48 puertos ocupan 1U o 2U en un rack de 19 pulgadas. Pueden ser rectas o anguladas (las anguladas ordenan mejor los cables) y con puertos keystone intercambiables o fijos al panel. Conviene dejar un 20% o 30% de puertos libres para crecer.' },
      { title: '🔧 Blindaje y puesta a tierra', text: 'UTP no tiene malla y sirve en ambientes normales. FTP y STP llevan blindaje y requieren una patchera blindada con conexión a tierra: si no se conecta a tierra, el blindaje puede empeorar el resultado. Cerca de motores, tableros eléctricos o líneas de alta tensión conviene cable blindado.' },
      { title: '✅ Instalación y certificación', text: 'Un buen cableado depende de la mano de obra: respetar el radio de curvatura, no destrenzar de más los pares, usar la misma norma de colores en todo el sitio (T568A o T568B) y certificar cada punto con un certificador. Cable, patchera, keystone y patch cord deben ser de la misma categoría.' },
    ]}
    eleccionTitulo="🎯 ¿Cuál elegir según tu uso?"
    elecciones={[
      ['🏠 Casa o local chico', 'patchera de 12 puertos Cat5e o Cat6 con un switch Gigabit.'],
      ['🏢 Oficina de 20 a 40 puestos', 'patchera de 24 o 48 puertos Cat6 con cable UTP.'],
      ['📶 Access points Wi-Fi 6/7', 'Cat6A, para sostener 2,5 o 10 Gbps por boca.'],
      ['📹 Cámaras IP con PoE', 'Cat6 o Cat6A; en distancias largas, cable de cobre puro (no CCA).'],
      ['🖥️ Rack de servidores', 'Cat6A blindada o fibra para los enlaces entre switches y servidores.'],
      ['🏭 Entre pisos o edificios', 'fibra óptica con ODF y conectores LC.'],
    ]}
  />
);

export default PatcherasPage;
