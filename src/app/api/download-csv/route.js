export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';
import { parse } from 'json2csv';

export async function GET() {
  try {
    await connectDB();
    const products = await Producto.find().lean();
    if (!products || products.length === 0) return NextResponse.json({ error: 'No products found' }, { status: 404 });
    const fields = [
      'cod_producto','n_producto','nombre','marca','vehiculo','categoria','descripcion','destacados','modelo','n_serie','titulo_de_producto','n_electronica','medidas','foto_1_1','foto_1_2','foto_1_3','foto_1_4',
    ];
    const csv = parse(products, { fields });
    return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=products.csv' } });
  } catch (error) {
    console.error('Error downloading CSV:', error);
    return NextResponse.json({ error: 'Error downloading CSV' }, { status: 500 });
  }
}
