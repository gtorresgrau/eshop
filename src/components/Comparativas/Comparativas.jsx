import React from "react"
import Link from "next/link"
import { HardDrive, MemoryStick, SquarePower, CircuitBoard, Cpu, Wifi } from "lucide-react"

const comparisonData = [
  { href: "/comparativas/almacenamiento", title: "Almacenamiento", description: "HDD, SSD SATA, M.2 NVMe Gen3/4/5. Velocidades, precios y usos recomendados.", icon: <HardDrive className="h-8 w-8" /> },
  { href: "/comparativas/memoria", title: "Memoria RAM", description: "DDR3, DDR4, DDR5 y ECC. Frecuencias, latencias y cuánta RAM necesitás.", icon: <MemoryStick className="h-8 w-8" /> },
  { href: "/comparativas/fuente", title: "Fuentes de Alimentación", description: "Bronze, Gold, Platinum, Titanium. Qué certificación y wattaje elegir.", icon: <SquarePower className="h-8 w-8" /> },
  { href: "/comparativas/mothers", title: "Motherboard", description: "Intel vs AMD, chipsets, sockets, formatos ATX/MicroATX/Mini-ITX.", icon: <CircuitBoard className="h-8 w-8" /> },
  { href: "/comparativas/procesadores", title: "Procesadores", description: "Intel Core i3/i5/i7/i9 vs AMD Ryzen 3/5/7/9. Núcleos, GHz, TDP y usos.", icon: <Cpu className="h-8 w-8" /> },
  { href: "/comparativas/tecnologias", title: "Tecnologías y Conectividad", description: "USB, PCIe, HDMI, DisplayPort, Wi-Fi 6/7, Thunderbolt. Guía completa.", icon: <Wifi className="h-8 w-8" /> },
]

const Comparativas = () => {
  return (
    <section id="comparaciones" className="mx-auto max-w-2xl py-16 px-4 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="mb-8 text-3xl md:text-4xl text-center font-extrabold text-primary uppercase">Comparativas</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {comparisonData.map((item, index) => (
          <ComparisonCard key={index} {...item} />
        ))}
      </div>
    </section>
  )
}

const ComparisonCard = ({ href, title, description, icon }) => (
  <Link href={href} className="block" title={`Ver comparativa de ${title}`} aria-label={`Ver comparativa de ${title}`}>
    <div className="h-full md:p-6 p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-lg border border-gray-100">
      <div className="flex items-center space-x-4 mb-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </Link>
)

export default Comparativas
