import GuiaTecnica from './GuiaTecnica';

const SwitchesPage = () => (
  <GuiaTecnica
    titulo="Comparativa de Switches de Red"
    intro="No administrables, smart, administrables y capa 3. Velocidades, PoE, VLAN y puertos de subida para elegir el switch correcto para tu oficina, local o red."
    opciones={[
      { emoji: '🟢', title: 'No administrable', description: 'Plug and play, sin configuración. Ideal para casa, oficina chica o ampliar bocas de red.' },
      { emoji: '🔵', title: 'Smart / Web managed', description: 'Configuración básica por web: VLAN, QoS y espejado de puertos a un costo moderado.' },
      { emoji: '🟣', title: 'Administrable Capa 2', description: 'CLI y SNMP, VLAN, STP, LACP y seguridad por puerto. Para redes de empresa.' },
      { emoji: '🔴', title: 'Capa 3', description: 'Enrutamiento entre VLAN y rutas estáticas o dinámicas. Para redes medianas y grandes.' },
    ]}
    tablaTitulo="Tabla comparativa de switches"
    columnas={['Tipo', 'Puertos típicos', 'Velocidad', 'VLAN', 'PoE', 'Subida (uplink)', 'Uso ideal']}
    filas={[
      ['No administrable 5-8 puertos', '5 / 8', '10/100 o Gigabit', 'No', 'No', 'Puerto común', 'Casa, escritorio, ampliar red'],
      ['No administrable 16-24 puertos', '16 / 24', 'Gigabit', 'No', 'Opcional', 'Puerto común o 2 SFP', 'Oficina chica, locales'],
      ['Smart 24 puertos PoE', '24 + 2 SFP', 'Gigabit', 'Sí (802.1Q)', '802.3af/at', '2 SFP 1G', 'Cámaras IP, telefonía IP, Wi-Fi'],
      ['Administrable L2 24/48 puertos', '24 / 48 + 4 SFP+', 'Gigabit', 'Sí', 'Opcional', '4 SFP+ 10G', 'Empresas, sucursales'],
      ['Multigigabit 2.5G / 5G', '8 / 24', '2.5G / 5G', 'Según modelo', 'PoE+ / PoE++', 'SFP+ 10G', 'Wi-Fi 6/6E/7, estaciones de trabajo'],
      ['Capa 3 10G', '24 / 48 + 4 SFP28', '1G / 10G', 'Sí + enrutamiento', 'Opcional', 'SFP+/SFP28 10-25G', 'Distribución y núcleo de red'],
    ]}
    conceptos={[
      { title: '🔌 PoE: qué estándar necesito', text: 'PoE 802.3af entrega hasta 15,4 W por puerto, PoE+ 802.3at hasta 30 W y PoE++ 802.3bt hasta 60 o 90 W. Una cámara IP o un teléfono usan af; un access point Wi-Fi 6/7 o una cámara PTZ suelen pedir at o bt. Mirá siempre el presupuesto PoE total del switch, no solo el de cada puerto.' },
      { title: '🧩 VLAN y administración', text: 'Las VLAN separan la red en segmentos lógicos (invitados, cámaras, administración) sin comprar más equipos. Si necesitás VLAN, priorizar tráfico (QoS) o monitorear, el switch tiene que ser smart o administrable; uno no administrable no las soporta.' },
      { title: '🚀 Velocidad y puertos de subida', text: 'Un switch Gigabit con uplink de 1 Gbps se vuelve cuello de botella cuando muchos equipos hablan con un servidor o NAS. Para eso existen los puertos SFP/SFP+ de 1G/10G, que se conectan por fibra o cable DAC. Calculá la capacidad de conmutación (backplane) para que sea mayor a la suma de todos los puertos.' },
    ]}
    eleccionTitulo="🎯 ¿Cuál elegir según tu uso?"
    elecciones={[
      ['🏠 Casa o escritorio', 'switch Gigabit no administrable de 5 u 8 puertos.'],
      ['📹 Cámaras IP (CCTV)', 'switch PoE de 8 o 16 puertos, con presupuesto PoE mayor a la suma de las cámaras.'],
      ['🏢 Oficina de 10 a 50 equipos', 'smart o administrable L2 de 24 puertos con 2 SFP de subida.'],
      ['📶 Red con varios access points', 'PoE+ con VLAN, para separar la red de invitados.'],
      ['🖥️ Servidores y NAS', 'puertos de 10G (SFP+) o multigigabit para evitar cuellos de botella.'],
      ['🏭 Red mediana o con varias VLAN', 'capa 3 para enrutar entre VLAN sin pasar por el router.'],
    ]}
  />
);

export default SwitchesPage;
