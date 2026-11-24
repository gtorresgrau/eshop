import dynamic from "next/dynamic";
import { Suspense } from "react";
import { notFound } from "next/navigation";

const Loading = dynamic(() => import('../../../components/Loading/Loading'));
const ClientLayout = dynamic(() => import('../../ClientLayout'));
import ProductosComparativa from '../../../components/Comparativas/ProductosComparativa';

// Productos del catálogo que se ofrecen al pie de cada comparativa (nombres de categoría tal como están en la base)
const productosByProducto = {
  memoria: { titulo: 'Memorias RAM disponibles', categorias: ['MEMORIAS'] },
  almacenamiento: { titulo: 'Discos SSD y HDD disponibles', categorias: ['DISCOS SSD', 'DISCOS HDD'] },
  fuente: { titulo: 'Fuentes de alimentación disponibles', categorias: ['FUENTES'] },
  mothers: { titulo: 'Motherboards disponibles', categorias: ['MOTHER ASROCK', 'MOTHER ASUS', 'MOTHER GIGABYTE'] },
  procesadores: { titulo: 'Procesadores disponibles', categorias: ['PROCESADORES'] },
  tecnologias: { titulo: 'Conectividad disponible', categorias: ['CONECTIVIDAD'] },
};

// Mapeo de los componentes según el producto
const comparisonComponents = {
  almacenamiento: dynamic(() => import("../../../components/Comparativas/Almacenamiento/AlmacenamientoPage")),
  memoria: dynamic(() => import("../../../components/Comparativas/MemoriaRam/MemoriaRamPage")),
  fuente: dynamic(() => import("../../../components/Comparativas/Fuentes/FuentePage")),
  mothers: dynamic(() => import("../../../components/Comparativas/Mother/MothersPage")),
  procesadores: dynamic(() => import("../../../components/Comparativas/Procesadores/ProcesadoresPage")),
  tecnologias: dynamic(() => import("../../../components/Comparativas/Tecnologias/TecnologiasPage")),
  switches: dynamic(() => import("../../../components/Comparativas/Redes/SwitchesPage")),
  core: dynamic(() => import("../../../components/Comparativas/Redes/CorePage")),
  patcheras: dynamic(() => import("../../../components/Comparativas/Redes/PatcherasPage")),
  servidores: dynamic(() => import("../../../components/Comparativas/Redes/ServidoresPage")),
};

const metaByProducto = {
  almacenamiento: {
    title: "Comparativa de Almacenamiento HDD vs SSD NVMe | Eshop Devices",
    description: "Compará HDD, SSD SATA, M.2 SATA y NVMe Gen3/4/5. Velocidades, precios, usos recomendados. Guía completa para elegir el mejor disco rígido o SSD en Argentina.",
    keywords: "HDD vs SSD, NVMe PCIe 4 Argentina, SSD M.2 comparativa, disco rígido precio, SSD barato, almacenamiento para gaming, eshop devices wilde",
    canonical: "/comparativas/almacenamiento",
  },
  memoria: {
    title: "Comparativa Memoria RAM DDR4 vs DDR5 | Eshop Devices",
    description: "Diferencias entre DDR3, DDR4 y DDR5. Frecuencias, latencias, capacidades y qué RAM elegir para gaming, edición o workstation. Guía actualizada 2025.",
    keywords: "RAM DDR4 vs DDR5, memoria RAM Argentina, DDR5 precio, latencia CAS RAM, RAM gaming, ECC memoria servidor, eshop devices",
    canonical: "/comparativas/memoria",
  },
  fuente: {
    title: "Comparativa Fuentes de Alimentación 80 PLUS | Eshop Devices",
    description: "Conocé las diferencias entre fuentes Bronze, Silver, Gold, Platinum y Titanium. Qué wattaje necesita tu PC y qué certificación elegir. Guía 2025.",
    keywords: "fuente 80 plus gold Argentina, fuente ATX precio, wattaje PC gaming, fuente modular, fuente bronze vs gold, eshop devices wilde",
    canonical: "/comparativas/fuente",
  },
  mothers: {
    title: "Comparativa Motherboards Intel vs AMD | Eshop Devices",
    description: "Diferencias entre chipsets Intel Z790, B760, H610 y AMD X670, B650, A620. Sockets LGA1700 y AM5, formatos ATX, MicroATX y Mini-ITX. Guía 2025.",
    keywords: "motherboard Intel AMD comparativa, placa madre AM5 Argentina, chipset Z790 B650, LGA1700 placas, mother gaming precio, eshop devices",
    canonical: "/comparativas/mothers",
  },
  procesadores: {
    title: "Comparativa Procesadores Intel vs AMD 2025 | Eshop Devices",
    description: "Comparación completa entre Intel Core i3, i5, i7, i9 y AMD Ryzen 3, 5, 7, 9. Núcleos, frecuencias, TDP y usos. Elegí el mejor procesador para gaming o workstation.",
    keywords: "procesador Intel AMD comparativa, Intel i5 vs Ryzen 5, CPU gaming Argentina, mejor procesador 2025, Intel i9 precio, Ryzen 9 workstation, eshop devices",
    canonical: "/comparativas/procesadores",
  },
  tecnologias: {
    title: "Guía de Tecnologías PC: USB, PCIe, WiFi, Puertos | Eshop Devices",
    description: "Entendé las diferencias entre USB 2.0 al USB4/Thunderbolt 5, PCIe 3/4/5, HDMI vs DisplayPort, WiFi 6/6E/7. Guía técnica completa para armar o actualizar tu PC.",
    keywords: "USB4 vs Thunderbolt, PCIe 4 vs PCIe 5, HDMI 2.1 vs DisplayPort, WiFi 6E Argentina, guía tecnología PC 2025, eshop devices wilde",
    canonical: "/comparativas/tecnologias",
  },
  switches: {
    title: "Comparativa de Switches: PoE, VLAN, Gigabit y 10G | Eshop Devices",
    description: "Diferencias entre switches no administrables, smart, administrables y capa 3. PoE, VLAN, puertos SFP+ y cuál elegir para tu oficina, cámaras IP o red empresarial.",
    keywords: "switch administrable vs no administrable, switch PoE Argentina, switch gigabit, switch capa 3, switch 24 puertos, VLAN, eshop devices wilde",
    canonical: "/comparativas/switches",
  },
  core: {
    title: "Switch Core, Distribución y Acceso: Guía de Red | Eshop Devices",
    description: "Cómo armar una red empresarial en tres capas: acceso, distribución y core. Redundancia, capa 3, 10G/25G/100G y qué exigirle a un switch core.",
    keywords: "switch core, red tres capas, switch capa 3, core colapsado, switch 10G, LACP stacking, red empresarial, eshop devices wilde",
    canonical: "/comparativas/core",
  },
  patcheras: {
    title: "Comparativa de Patcheras y Cableado Cat5e, Cat6, Cat6A | Eshop Devices",
    description: "Patch panels de 12, 24 y 48 puertos y categorías Cat5e, Cat6, Cat6A, Cat8 y fibra óptica. Velocidades, distancias, blindaje y cuál elegir para tu rack.",
    keywords: "patchera 24 puertos, patch panel Cat6, cableado estructurado, Cat6A vs Cat6, ODF fibra óptica, rack 19 pulgadas, eshop devices wilde",
    canonical: "/comparativas/patcheras",
  },
  servidores: {
    title: "Comparativa de Servidores: Torre, Rack y Blade | Eshop Devices",
    description: "Diferencias entre servidores torre, rack 1U/2U/4U y blade. Procesadores Xeon y EPYC, memoria ECC, RAID, fuentes redundantes y cuál elegir para tu empresa.",
    keywords: "servidor torre vs rack, servidor Xeon EPYC, memoria ECC, RAID 5 RAID 10, servidor para pyme, virtualización, eshop devices wilde",
    canonical: "/comparativas/servidores",
  },
};

export async function generateMetadata({ params }) {
  const { producto } = await params;
  const meta = metaByProducto[producto];
  if (!meta) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eshopdevices.com";

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${siteUrl}${meta.canonical}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${siteUrl}${meta.canonical}`,
      type: "website",
      images: [{ url: `${siteUrl}/logos/logoEshop.webp` }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${siteUrl}/logos/logoEshop.webp`],
    },
  };
}

const ComparativaPage = async ({ params }) => {
  const { producto } = await params;

  if (!comparisonComponents[producto]) {
    notFound();
  }

  const SelectedComponent = comparisonComponents[producto];

  return (
    <ClientLayout>
      <main className="flex-1 flex items-center justify-center bg-white">
        <Suspense fallback={<Loading />}>
          <SelectedComponent />
        </Suspense>
      </main>
      {productosByProducto[producto] && <ProductosComparativa {...productosByProducto[producto]} />}
    </ClientLayout>
  );
};

export default ComparativaPage;

export async function generateStaticParams() {
  return [
    { producto: "almacenamiento" },
    { producto: "memoria" },
    { producto: "fuente" },
    { producto: "mothers" },
    { producto: "procesadores" },
    { producto: "tecnologias" },
    { producto: "switches" },
    { producto: "core" },
    { producto: "patcheras" },
    { producto: "servidores" },
  ];
}

export const revalidate = 14400;
