import { NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/mongodb'
import User from '../../../../models/User'
import { getSesion } from '../../../../lib/sesion'

export async function GET(request) {
  const sesion = await getSesion()
  if (!sesion) return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const usuarioUid = searchParams.get('usuarioUid')
  if (sesion.rol !== 'admin' && usuarioUid !== sesion.uid) return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })

  if (!usuarioUid) {
    return NextResponse.json({ message: 'Falta el UID del usuario' }, { status: 400 })
  }

  try {
    await connectDB()
    const user = await User.findOne({ uid: usuarioUid }).select('factura')

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, factura: user.factura || null })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 })
  }
}
