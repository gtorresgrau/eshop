// app/utils/cookiesStorage.ts (server-side version)

import { cookies } from 'next/headers';

export const setInLocalStorage = async (key: string, value: any) => {
  const cookieStore = await cookies();
  cookieStore.set(key, JSON.stringify(value), {
    httpOnly: false, // cambia a true si no lo necesitas en el cliente
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 día
  });
};

export const getInLocalStorage = async (key: string) => {
  const cookieStore = await cookies();
  const value = cookieStore.get(key)?.value;
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error al parsear cookie ${key}:`, error);
    return null;
  }
};

export const removeFromLocalStorage = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.set(key, '', {
    maxAge: 0,
    path: '/',
  });
};
