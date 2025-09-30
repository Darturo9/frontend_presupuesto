'use client';

import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/lib/hooks/useAuth';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className = "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition",
  children = "Cerrar sesión"
}: LogoutButtonProps) {
  const { logout: authLogout, session } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      console.log('🚫 Logout ya en proceso, ignorando click...');
      return; // Prevenir múltiples clicks
    }

    setIsLoggingOut(true);
    console.log('🚀 LOGOUT BUTTON: Iniciando proceso...');

    try {
      // PASO 1: Llamar al logout del hook para activar forceLogout
      console.log('📞 Llamando a authLogout del hook...');
      await authLogout();

      // PASO 2: Si hay sesión de Google/NextAuth, cerrarla
      if (session) {
        console.log('🔴 Cerrando sesión de NextAuth...');
        await nextAuthSignOut({
          redirect: false,
          callbackUrl: '/'
        });
      }

      // PASO 3: Limpiar cookies agresivamente
      console.log('🧹 Limpiando cookies...');

      // Limpiar token con js-cookie
      Cookies.remove('token');
      Cookies.remove('token', { path: '/' });
      Cookies.remove('token', { path: '/', domain: window.location.hostname });

      // Método más agresivo: borrar directamente con document.cookie
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = `token=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

      // Limpiar cookies de NextAuth
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
        Cookies.remove(cookie, { path: '/' });
        Cookies.remove(cookie, { path: '/', domain: window.location.hostname });
      });

      // PASO 4: Limpiar storage
      console.log('🗑️ Limpiando storage...');
      localStorage.clear();
      sessionStorage.clear();

      // Verificar si se borró
      console.log('🔍 Token después de borrar:', Cookies.get('token') ? 'AÚN EXISTE ❌' : 'Borrado correctamente ✅');

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