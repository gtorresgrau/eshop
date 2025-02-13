"use client"

import React from "react"
import Link from "next/link"
import { HardDrive, MemoryStick, SquarePower } from "lucide-react"

const Comparativas = () => {
  return (
    <section id="comparaciones" className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="mb-8 text-3xl md:text-4xl text-center font-extrabold text-primary uppercase">Comparativas</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ComparisonCard
          href="/comparativa/almacenamiento"
          title="Almacenamiento"
          description="Conoce las comparativas de los distintos tipos de almacenamiento"
          icon={<HardDrive className="h-8 w-8" />}
        />
        <ComparisonCard
          href="/comparativa/memoria"
          title="Memoria RAM"
          description="Explora las comparativas de los diferentes tipos de Memoria RAM"
          icon={<MemoryStick className="h-8 w-8" />}
        />
        <ComparisonCard
          href="/comparativa/fuente"
          title="Fuentes de Alimentacion"
          description="Explora las comparativas de los diferentes tipos de Memoria RAM"
          icon={<SquarePower className="h-8 w-8" />}
        />
      </div>
    </section>
  )
}


const ComparisonCard = ({ href, title, description, icon }) => (
  <Link href={href} className="block">
    <div className="h-full p-6 bg-white rounded-lg shadow-md transition-transform hover:scale-105 hover:shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
)

export default Comparativas

