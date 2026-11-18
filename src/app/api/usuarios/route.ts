//app/api/usuarios/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Usuario from '../../../models/User';
import jwt from 'jsonwebtoken';
import { auth } from '../../../lib/firebaseAdmin';

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
        } catch {
            return NextResponse.json({ error: 'Unauthorized: Invalid Firebase ID token' }, { status: 401 });
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
            usuario.nombreCompleto = nombreCompleto || usuario.nombreCompleto;
            usuario.correo = correo || usuario.correo;
            usuario.dniOCuit = cleanDniOCuit || usuario.dniOCuit;
            usuario.telefono = telefono || usuario.telefono;
            usuario.direccion = direccion || usuario.direccion;
            await usuario.save();
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

    } catch (error) {
        console.error('Error en /api/usuarios:', error);
        return NextResponse.json({ error: 'Error al crear/actualizar usuario' }, { status: 500 });
    }
}
