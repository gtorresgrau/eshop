'use client'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useUser from '../../Hooks/useUser';
import { getInLocalStorage } from '../../Hooks/localStorage';

// Importaciones directas (para componentes críticos es preferible no cargarlos dinámicamente)
import Loading from '@/components/Loading/Loading';
import NotFoundPage from '@/app/not-found';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // Suponiendo que useUser es la fuente principal de datos de autenticación.
  const user = useUser();
  // Si aún usas localStorage, puedes obtenerlo en una variable, pero idealmente centraliza la info.
  const storedUser = getInLocalStorage('USER');
  const router = useRouter();
  const pathname = usePathname();

  // Define las rutas protegidas y las de autenticación
  const protectedRoutes = ['/Admin'];
  const authRoutes = ['/user/Login'];

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  // Por ejemplo, podrías considerar otras rutas como "no autorizadas" si es necesario.
  const isUnknownRoute = !isProtectedRoute && !isAuthRoute && pathname !== '/';

  useEffect(() => {
    // Si el usuario ya está logueado y está en una ruta de autenticación, redirige a /Admin
    if (isAuthRoute && storedUser) {
      router.push('/Admin');
      return; // Evita ejecutar el resto del efecto
    }
    // Aquí podrías agregar lógica adicional, por ejemplo, redirigir a login si no hay usuario
    // o mostrar NotFound en rutas protegidas sin acceso.
    setIsLoading(false);
  }, [isAuthRoute, storedUser, router]);

  // Mientras se procesa la verificación, muestra el loading
  if (isLoading) {
    return <Loading ancho="120px" alto="120px" />;
  }

  // Si la ruta es desconocida o es una ruta protegida y no hay usuario, muestra NotFound
  if (isUnknownRoute || (isProtectedRoute && !storedUser)) {
    return <NotFoundPage />;
  }

  // Si pasa todas las comprobaciones, renderiza el contenido protegido
  return children;
};

export default ProtectedRoute;
