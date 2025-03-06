'use client' 
import React from 'react'
import dynamic from 'next/dynamic';

const StarLinkAdapterInfo = dynamic(() => import('@/components/Productos/Starlink/StarLinkAdapterInfo'))
const ClientLayout = dynamic(() => import('@/app/ClientLayout'))

const StarlinkPage = () => {

  return (
    <ClientLayout title='Fuente StarLink Mini' className="flex flex-col h-screen">
      <main className="flex-1 flex items-center justify-center bg-white">
        <StarLinkAdapterInfo />
      </main>
    </ClientLayout>
  )
}

export default StarlinkPage;
