//src/Hooks/useAuth.ts
'use client';
import { useEffect, useState } from 'react';

type UserData = {
  id: string;
  uid: string;
  rol: 'admin' | 'cliente' | string;
};

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('No autorizado');

        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'admin';
  const isClient = user?.rol === 'cliente';

  return { user, loading, isAuthenticated, isAdmin, isClient };
}
