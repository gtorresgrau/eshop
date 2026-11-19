export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { guardAdmin } from '../../../../lib/sesion';
import Usuario from '../../../../models/User';

// Lista de usuarios registrados (solo admin), del más nuevo al más viejo.
export async function GET() {
  const denegado = await guardAdmin();
  if (denegado) return denegado;
  try {
    await connectDB();
    const usuarios = await Usuario.find({}, 'nombreCompleto correo rol telefono dniOCuit fechaRegistro direccion.ciudad direccion.provincia')
      .sort({ fechaRegistro: -1 })
      .limit(1000)
      .lean();
    return NextResponse.json({ total: usuarios.length, usuarios });
  } catch (e) {
    console.error('[admin/usuarios]', e?.message);
    return NextResponse.json({ error: 'No se pudo leer la lista de usuarios' }, { status: 500 });
  }
}
