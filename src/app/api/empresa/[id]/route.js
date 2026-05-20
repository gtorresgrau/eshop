import { connectDB } from '../../../../lib/mongodb';
import Empresa from '../../../../models/empresaSchema';

export async function PUT(req, props) {
  const params = await props.params;
  await connectDB();
  const data = await req.json();
  const empresaActualizada = await Empresa.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(empresaActualizada);
}

export async function DELETE(req, props) {
  const params = await props.params;
  await connectDB();
  await Empresa.findByIdAndDelete(params.id);
  return Response.json({ message: 'Empresa eliminada' });
}
