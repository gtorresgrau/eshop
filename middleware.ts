import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// --- Configuración ---
const PUBLIC_PATHS = new Set<string>([
  '/',                 // si querés que el home sea público
  '/user/Login',
  '/user/Register',
]);

const ADMIN_PREFIX = '/Admin';
const CLIENT_PREFIXES = ['/Dashboard', '/perfil']; // rutas sólo para clientes

// Verificación de JWT con algoritmo explícito
async function verifyToken(token: string) {
  const secretString = process.env.JWT_SECRET;
  if (!secretString) throw new Error('JWT_SECRET is not set');
  const secret = new TextEncoder().encode(secretString);
  return jwtVerify(token, secret, { algorithms: ['HS256'] });
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get('token')?.value ?? null;

  // 1) Rutas públicas → no tocar
  if (PUBLIC_PATHS.has(pathname) || Array.from(PUBLIC_PATHS).some(p => p !== '/' && pathname.startsWith(p + '/'))) {
    // Si tiene token e intenta ir a Login/Register, redirigí según rol
    if (token && (pathname.startsWith('/user/Login') || pathname.startsWith('/user/Register'))) {
      try {
        const { payload } = await verifyToken(token);
          // IMPORTANTE: soportar ambos claims ('role' en inglés o 'rol' en español)
          const role = ((payload as any).role ?? (payload as any).rol) as string | undefined;
        const redirectPath = role === 'admin' ? '/Admin' : '/Dashboard';
        return NextResponse.redirect(new URL(redirectPath, origin));
      } catch {
        // token inválido: dejar pasar como público
      }
    }
    return NextResponse.next();
  }

  // 2) Resto de rutas (protegidas por matcher): requiere token
  if (!token) {
    const res = NextResponse.redirect(new URL('/user/Login', origin));
    return res;
  }

  // 3) Validar token
  try {
  const { payload } = await verifyToken(token);
  // Soportar ambos nombres de claim: 'role' ó 'rol'
  const role = ((payload as any).role ?? (payload as any).rol) as string | undefined;

    // 3.a) Guardas de rol por segmento
    if (pathname.startsWith(ADMIN_PREFIX) && role !== 'admin') {
      return NextResponse.redirect(new URL('/Dashboard', origin));
    }

    if (CLIENT_PREFIXES.some(pref => pathname.startsWith(pref)) && role !== 'cliente') {
      // si quisiera, podrías enviar admins a /Admin
      return NextResponse.redirect(new URL(role === 'admin' ? '/Admin' : '/user/Login', origin));
    }

    // 3.b) OK, dejar pasar
    return NextResponse.next();
  } catch (error) {
    // Token inválido / expirado → limpiar cookie y a Login
    const res = NextResponse.redirect(new URL('/user/Login', origin));
    res.cookies.delete('token');
    return res;
  }
}

// Importante: el middleware SIEMPRE corre en Edge; no hace falta runtime acá.
export const config = {
  matcher: [
    // Listá lo que querés proteger con middleware:
    '/Admin/:path*',
    '/perfil/:path*',
    '/Dashboard/:path*',
    '/Ordenes/:path*',
    '/user/:path*', // para manejar redirecciones en login/register
    // si querés proteger TODO excepto estáticos, podrías usar: '/((?!_next|.*\\..*).*)'
  ],
};
