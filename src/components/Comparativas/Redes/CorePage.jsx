import GuiaTecnica from './GuiaTecnica';

const CorePage = () => (
  <GuiaTecnica
    titulo="Comparativa de Switch Core, Distribución y Acceso"
    intro="Cómo se organiza una red empresarial en tres capas: acceso, distribución y core. Qué función cumple cada una y qué características exigirle al equipo."
    opciones={[
      { emoji: '🟢', title: 'Capa de acceso', description: 'Donde se conectan PCs, teléfonos, cámaras y access points. Prioriza cantidad de puertos y PoE.' },
      { emoji: '🔵', title: 'Capa de distribución', description: 'Agrupa los switches de acceso, aplica VLAN, enrutamiento y políticas de seguridad.' },
      { emoji: '🟣', title: 'Capa core (núcleo)', description: 'La columna vertebral: mueve tráfico entre edificios, pisos y servidores a máxima velocidad.' },
      { emoji: '🔴', title: 'Borde (router / firewall)', description: 'Conecta la red con Internet y las sedes remotas: NAT, VPN, firewall y balanceo de enlaces.' },
    ]}
    tablaTitulo="Tabla comparativa de las capas de red"
    columnas={['Capa', 'Función', 'Velocidad típica', 'Capa OSI', 'Redundancia', 'Características clave']}
    filas={[
      ['Acceso', 'Conectar usuarios y dispositivos finales', '1G por puerto, subida 10G', 'Capa 2', 'Opcional', 'PoE, seguridad por puerto, 802.1X, VLAN'],
      ['Distribución', 'Agregar acceso y enrutar entre VLAN', '10G / 25G', 'Capa 3', 'Recomendada', 'Enrutamiento, ACL, QoS, LACP'],
      ['Core', 'Transporte rápido entre distribución, servidores y borde', '25G / 40G / 100G', 'Capa 3', 'Obligatoria', 'Fuentes y ventiladores redundantes, stacking o MLAG, alto backplane'],
      ['Core colapsado', 'Core y distribución en el mismo equipo (redes chicas y medianas)', '10G / 25G', 'Capa 3', 'Par de equipos', 'Dos switches L3 en alta disponibilidad con uplinks cruzados'],
    ]}
    conceptos={[
      { title: '🏗️ Modelo de tres capas', text: 'Separar acceso, distribución y core ordena el crecimiento y limita las fallas a un sector. En redes de hasta unos cientos de usuarios es común el "core colapsado": un par de switches L3 hace de distribución y core a la vez.' },
      { title: '🛡️ Redundancia y alta disponibilidad', text: 'El core no puede caerse. Se usan dos equipos, fuentes redundantes, ventiladores reemplazables en caliente y enlaces agregados (LACP) hacia cada capa inferior. Con stacking o MLAG, los dos switches se ven como uno solo y se evitan bucles.' },
      { title: '⚙️ Qué exigirle a un switch core', text: 'Enrutamiento capa 3 por hardware (wire speed), tabla MAC y de rutas amplia, puertos SFP+/SFP28/QSFP de 10G a 100G, QoS, ACL y soporte de monitoreo (SNMP, NetFlow o sFlow). Verificá también el soporte y la garantía del fabricante.' },
    ]}
    eleccionTitulo="🎯 ¿Qué necesita tu red?"
    elecciones={[
      ['🏢 Hasta 50 usuarios', 'no hace falta un core dedicado: un switch L2/L3 de 24 o 48 puertos con uplinks SFP+.'],
      ['🏬 50 a 300 usuarios', 'core colapsado: dos switches L3 con 10G redundantes y switches de acceso PoE.'],
      ['🏭 Varios pisos o edificios', 'tres capas con core de 25G/40G y fibra entre distribución y core.'],
      ['🖥️ Datacenter o virtualización', 'core o leaf/spine con puertos de 25G a 100G y baja latencia.'],
      ['🌐 Varias sedes', 'router o firewall de borde con VPN y balanceo de enlaces, más core en la sede central.'],
      ['📈 Querés crecer sin recambiar', 'elegí equipos apilables, con puertos SFP+ libres y fuentes redundantes.'],
    ]}
  />
);

export default CorePage;
