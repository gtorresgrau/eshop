import React, { Suspense } from 'react'
import dynamic from 'next/dynamic';

const HeaderSection = dynamic(() => import( '@/app/home/HeaderSection'))
const FooterSection = dynamic(() => import( '@/app/home/FooterSection'))
const StarLinkAdapterInfo = dynamic(() => import('@/components/Productos/Starlink/StarLinkAdapterInfo'), { ssr: false })

const StarlinkPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection />
      <main className="flex-1 flex items-center justify-center bg-white">
        <StarLinkAdapterInfo />
      </main>
      <FooterSection />
    </div>
  )
}

export default StarlinkPage