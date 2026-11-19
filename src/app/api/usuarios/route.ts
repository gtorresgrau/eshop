//app/api/usuarios/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Usuario from '../../../models/User';
import jwt from 'jsonwebtoken';
import { auth } from '../../../lib/firebaseAdmin';
import { permitir } from '../../../lib/antiBot';

// Alta / actualización del propio perfil + inicio de sesión.
// SEGURIDAD: la identidad sale SIEMPRE del token de Firebase verificado, nunca del cuerpo de la request.
// El rol nunca se toma del cliente: los usuarios nuevos son 'cliente'.
export async function POST(req: Request) {
    try {
        const authorizationHeader = req.headers.get('Authorization');
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
        }

        const idToken = authorizationHeader.split(' ')[1];
        let decoded;
        try {
            decoded = await auth.verifyIdToken(idToken);
        } catch (e: any) {
            // Se devuelve solo el código técnico (sin secretos) para poder diagnosticar credenciales/proyecto de Firebase
            console.error('[usuarios] verifyIdToken falló:', e?.code, e?.message);
            return NextResponse.json(
                { error: 'Unauthorized: Invalid Firebase ID token', code: e?.code || 'firebase-verify', motivo: String(e?.message || '').slice(0, 140) },
                { status: 401 }
            );
        }
        if (!process.env.JWT_SECRET) {
            console.error('[usuarios] JWT_SECRET no está definido');
            return NextResponse.json({ error: 'Configuración del servidor incompleta', code: 'JWT_SECRET_MISSING' }, { status: 500 });
        }
        const uid: string = decoded.uid; // identidad verificada

        await connectDB();
        const { nombreCompleto, correo, dniOCuit, telefono, direccion } = await req.json();

        const cleanDniOCuit = typeof dniOCuit === 'string' ? dniOCuit.trim() || undefined : undefined;
        if (cleanDniOCuit) {
            const usuarioConMismoDni = await Usuario.findOne({ dniOCuit: cleanDniOCuit, uid: { $ne: uid } });
            if (usuarioConMismoDni) {
                return NextResponse.json({ error: 'DNI/CUIT ya está en uso' }, { status: 400 });
            }
        }

        let usuario = await Usuario.findOne({ uid });
        let isNew = false;

        if (!usuario) {
            // Altas nuevas: máximo 5 por hora desde la misma IP (frena el registro masivo con bots)
            if (!(await permitir(req, 'alta-usuario', 5, 3600))) {
                return NextResponse.json({ error: 'Demasiados registros desde esta conexión. Probá más tarde.', code: 'rate-limit' }, { status: 429 });
            }
            usuario = new Usuario({
                uid,
                nombreCompleto,
                correo: decoded.email || correo,
                dniOCuit: cleanDniOCuit,
                telefono,
                direccion,
                rol: 'cliente',
            });
            await usuario.save();
            isNew = true;
        } else {
            // Se actualiza solo lo recibido con $set (sin save()): un dato viejo e inválido en otro campo
            // del usuario no debe impedir el inicio de sesión.
            const cambios: Record<string, unknown> = {};
            if (nombreCompleto) cambios.nombreCompleto = nombreCompleto;
            if (correo) cambios.correo = correo;
            if (cleanDniOCuit) cambios.dniOCuit = cleanDniOCuit;
            if (telefono) cambios.telefono = telefono;
            // Una dirección vacía ({}) no debe borrar la que ya existe
            if (direccion && typeof direccion === 'object' && Object.keys(direccion).length > 0) cambios.direccion = direccion;
            if (Object.keys(cambios).length > 0) {
                const actualizado = await Usuario.findOneAndUpdate({ uid }, { $set: cambios }, { new: true });
                if (actualizado) usuario = actualizado;
            }
        }
        const token = jwt.sign(
            {
                id: usuario._id,
                uid: usuario.uid,
                rol: usuario.rol,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        const response = NextResponse.json({ usuario, token }, { status: isNew ? 201 : 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        return response;

    } catch (error: any) {
        console.error('Error en /api/usuarios:', error);
        return NextResponse.json(
            { error: 'Error al crear/actualizar usuario', code: error?.name || 'error' },
            { status: 500 }
        );
    }
}
