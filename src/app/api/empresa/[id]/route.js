import { connectDB } from '../../../../lib/mongodb';
import Empresa from '../../../../models/empresaSchema';
import { guardAdmin } from '../../../../lib/sesion';

export async function PUT(req, { params }) {
  { const denied = await guardAdmin(); if (denied) return denied; }
  await connectDB();
  const data = await req.json();
  const empresaActualizada = await Empresa.findByIdAndUpdate((await params).id, data, { new: true });
  return Response.json(empresaActualizada);
}

export async function DELETE(req, { params }) {
  { const denied = await guardAdmin(); if (denied) return denied; }
  await connectDB();
  await Empresa.findByIdAndDelete((await params).id);
  return Response.json({ message: 'Empresa eliminada' });
}
