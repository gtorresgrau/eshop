import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import producto from '@/models/product';

export async function GET(request) {
  await connectDB();

  try {
    // Buscar todos los productos que tienen destacados: true
    const productosDestacados = await producto.find({ destacados: true });

    // Si no se encuentran productos destacados, devolver un mensaje adecuado
    if (productosDestacados.length === 0) {
      return NextResponse.json({ message: 'No se encontraron productos destacados' }, { status: 404 });
    }

    // Realizar la actualización que desees en los productos destacados
    // Aquí puedes modificar los productosDestacados según tus necesidades antes de guardarlos

    // Ejemplo de actualización: cambiar el precio de todos los productos destacados
    // productosDestacados.forEach(producto => {
    //   producto.precio *= 1.1; // Aumentar el precio en un 10%
    // });

    // Guardar los productos actualizados en la base de datos
    // const productosActualizados = await Promise.all(productosDestacados.map(producto => producto.save()));

    return NextResponse.json(productosDestacados, { status: 200 });
  } catch (error) {
    console.error('Error actualizando productos destacados:', error);
    return NextResponse.json({ error: 'Error actualizando productos destacados' }, { status: 500 });
  }
}
