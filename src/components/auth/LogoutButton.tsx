'use client';

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useState } from 'react';
import Cookies from 'js-cookie';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className = "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition",
  children = "Cerrar sesión"
}: LogoutButtonProps) {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      console.log('🚫 Logout ya en proceso, ignorando click...');
      return; // Prevenir múltiples clicks
    }

    setIsLoggingOut(true);
    console.log('🚀 LOGOUT BUTTON: Iniciando proceso...');

    try {
      // Estrategia simple: limpiar todo y recargar
      console.log('🧹 Limpiando cookies...');

      // Limpiar nuestras cookies
      Cookies.remove('token');

      // Limpiar cookies de NextAuth (todas las variantes posibles)
      const cookiesToRemove = [
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'next-auth.csrf-token',
        '__Secure-next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.callback-url'
      ];

      cookiesToRemove.forEach(cookie => {
        Cookies.remove(cookie);
        // También intentar remover con diferentes paths
        Cookies.remove(cookie, { path: '/' });
        Cookies.remove(cookie, { path: '/', domain: window.location.hostname });
      });

      console.log('🗑️ Limpiando storage...');
      localStorage.clear();
      sessionStorage.clear();

      // Si hay sesión de Google, cerrar NextAuth
      if (session) {
        console.log('🔴 Cerrando sesión de NextAuth...');
        await nextAuthSignOut({
          redirect: false,
          callbackUrl: '/'
        });
      }

      console.log('🔄 Redirigiendo a home...');

      // Hard redirect para limpiar completamente el estado
      window.location.replace('/');

    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Fallback: recargar la página de todas formas
      window.location.replace('/');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${className} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoggingOut ? 'Cerrando sesión...' : children}
    </button>
  );
}