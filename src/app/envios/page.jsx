import React from 'react'
import dynamic from 'next/dynamic';

const HeaderSection = dynamic(() => import( '../home/HeaderSection'))
const EnviosPage = dynamic(() => import( '@/components/Envios/EnviosPage'), { ssr: false })
const FooterSection = dynamic(() => import( '../home/FooterSection'))

const Envios = () => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection />
      <main className="flex-1 flex items-center justify-center bg-white">
        <EnviosPage />
      </main>
      <FooterSection />
    </div>
  )
}

export default Envios