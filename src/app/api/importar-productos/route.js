// /app/api/importar-productos/route.js
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { promisify } from 'util';
import producto from '@/models/producto';
import connectDB from '@/lib/db'; // Asegurate de tener esta conexión a MongoDB

export const config = {
  api: {
    bodyParser: false, // necesario para subir archivos
  },
};

const readFile = promisify(fs.readFile);

export async function POST(req) {
  await connectDB();

  const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const filePath = data.files.file[0].filepath;

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets['Productos'];

  const jsonData = XLSX.utils.sheet_to_json(sheet, { range: 6 }); // Empieza después de fila 6

  const productosFormateados = jsonData.map((item, index) => ({
    cod_producto: String(item['CóD. ARTíCULO'] || '').trim(),
    n_producto: index + 1,
    marca: 'DIAC',
    categoria: 'General',
    nombre: String(item['DESCRIPCIóN'] || '').trim(),
    modelo: '',
    n_serie: '',
    titulo_de_producto: String(item['DESCRIPCIóN'] || '').trim(),
    descripcion: String(item['DESC_ADIC'] || '').trim(),
    n_electronica: '',
    precio: String(item['FINAL'] || '').trim(),
    destacados: false,
    usd: true,
    usado: false,
    vendido: false,
    medidas: '',
    foto_1_1: '',
    foto_1_2: '',
    foto_1_3: '',
    foto_1_4: '',
  }));

  try {
    await producto.insertMany(productosFormateados, { ordered: false });
    return NextResponse.json({ message: 'Productos importados correctamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al importar productos' }, { status: 500 });
  }
}
