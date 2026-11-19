import React from 'react'
import dynamic from 'next/dynamic';

const ShopCart = dynamic(() => import("../../components/Tienda/ShoopingCart/ShopCart"));
const ClientLayout = dynamic(() => import("../ClientLayout"));


const Shopcart = () => {
  return (
    <ClientLayout>
      <main className="bg-white">
        <ShopCart />
      </main>
    </ClientLayout>
  )
}

export default Shopcart