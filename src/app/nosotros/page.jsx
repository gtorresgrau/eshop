import React, { Suspense } from 'react'
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import( '@/components/Loading/Loading'))
const HeaderSection = dynamic(() => import( '../home/HeaderSection'))
const FooterSection = dynamic(() => import( '../home/FooterSection'))
const NosotrosPage = dynamic(() => import( '@/components/SobreMi/NosotrosPage'), { ssr: false })

const NosPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection />
      <main className="flex-1 flex items-center justify-center bg-white">
        <Suspense fallback={<Loading/>}>
          <NosotrosPage />
        </Suspense>
      </main>
      <FooterSection />
    </div>
  )
}

export default NosPage