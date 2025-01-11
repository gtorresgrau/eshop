// pages/api/products/update-featured.js

import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Producto from '../../../models/product';

export async function PUT(request) {
  await connectDB();

  try {
    const { _id, destacados } = await request.json();
    //console.log(_id,destacados,'res')
    // Buscar el producto por su ID y actualizar el campo destacados
    const updatedProduct = await Producto.findByIdAndUpdate(
      _id,
      { destacados },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}
