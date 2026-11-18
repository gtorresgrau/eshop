// src/app/api/usuarios/[uid]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Usuario from '../../../../models/User';
import { getSesion } from '../../../../lib/sesion';

// Solo el propio usuario o un admin.
async function verificarAutenticacion(uid: string) {
    const sesion = await getSesion();
    if (!sesion) {
        return { autorizado: false, error: 'No autorizado', status: 401 };
    }
    if (sesion.uid !== uid && sesion.rol !== 'admin') {
        return { autorizado: false, error: 'Acceso denegado - Solo puedes acceder a tu propia información', status: 403 };
    }
    return { autorizado: true, sesion };
}

// Campos que el propio usuario puede editar. NUNCA `rol`, `uid`, `orders` ni `_id`.
const CAMPOS_EDITABLES = ['nombreCompleto', 'correo', 'dniOCuit', 'telefono', 'direccion', 'factura'] as const;

export async function GET(req: Request, context: { params: Promise<{ uid: string }> }) {
    const { uid } = await context.params;

    const auth = await verificarAutenticacion(uid);
    if (!auth.autorizado) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await connectDB();
        const usuario = await Usuario.findOne({ uid }).select('-__v');

        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const usuarioSafe = usuario.toObject();
        delete usuarioSafe._id;

        return NextResponse.json(usuarioSafe);
    } catch (error) {
        console.error('Error en GET /api/usuarios/[uid]:', error);
        return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
    }
}

export async function PUT(req: Request, context: { params: Promise<{ uid: string }> }) {
    const { uid } = await context.params;

    const auth = await verificarAutenticacion(uid);
    if (!auth.autorizado) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await connectDB();
        const body = await req.json();

        // Lista blanca: evita que se pueda escalar privilegios enviando `rol: "admin"` u otros campos.
        const cambios: Record<string, unknown> = {};
        for (const campo of CAMPOS_EDITABLES) {
            if (body && Object.prototype.hasOwnProperty.call(body, campo)) cambios[campo] = body[campo];
        }
        // El rol solo lo cambia un admin, y únicamente a un valor válido.
        if (auth.sesion?.rol === 'admin' && (body?.rol === 'admin' || body?.rol === 'cliente')) {
            cambios.rol = body.rol;
        }

        const usuarioActualizado = await Usuario.findOneAndUpdate(
            { uid },
            { $set: cambios },
            { new: true, runValidators: true }
        );

        if (!usuarioActualizado) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(usuarioActualizado);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ uid: string }> }) {
    const { uid } = await context.params;

    const auth = await verificarAutenticacion(uid);
    if (!auth.autorizado) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await connectDB();
        const eliminado = await Usuario.findOneAndDelete({ uid });

        if (!eliminado) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
    }
}
