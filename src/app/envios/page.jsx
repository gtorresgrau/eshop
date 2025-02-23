import React, { Suspense } from 'react'
import dynamic from 'next/dynamic';
const BotonWsp = dynamic(() => import( '@/components/BotonWSP/BotonWsp'))
const EnviosPage = dynamic(() => import( '@/components/Envios/EnviosPage'))
const Footer = dynamic(() => import( '@/components/Footer/Footer'))
const Loading = dynamic(() => import( '@/components/Loading/Loading'), { ssr: false })
const NavBar = dynamic(() => import( '@/components/NavBar/NavBar'))
const VolverArriba = dynamic(() => import( '@/components/VolverArriba/VolverArriba'))

const Envios = () => {
  return (
    <div className="flex flex-col h-screen">
      <nav className="">
        <Suspense fallback={<Loading/>}>
            <NavBar />
        </Suspense>
      </nav>
      <main className="flex-1 flex items-center justify-center bg-white">
        <EnviosPage />
      </main>
      <footer className="bg-gray-200">
        <Footer />
        <VolverArriba />
        <BotonWsp />
      </footer>
    </div>
  )
}

export default Envios