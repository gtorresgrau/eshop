import React from 'react'
import dynamic from 'next/dynamic';

const ShopCart = dynamic(() => import("../../components/Tienda/ShoopingCart/ShopCart"));

const Shopcart = () => {
  return (
    <section>
        <ShopCart />
    </section>
  )
}

export default Shopcart