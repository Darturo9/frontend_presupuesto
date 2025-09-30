'use client';

import { useState } from 'react';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useAuth } from '@/lib/hooks/useAuth';


export default function Header() {
    const { logout: authLogout, session } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLogin = () => {
        setShowLoginModal(true);
    };

    const handleLogout = async () => {
        console.log('🚀 LOGOUT: Iniciando...');

        // Activar forceLogout en el hook
        await authLogout();

        // Cerrar sesión de NextAuth si existe
        if (session) {
            await nextAuthSignOut({ redirect: false });
        }

        // Borrar cookies agresivamente
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' });
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Limpiar storage
        localStorage.clear();
        sessionStorage.clear();

        console.log('✅ Token borrado, redirigiendo...');

        setIsAuthenticated(false);

        // Redirigir a home
        window.location.replace('/');
    };

    return (
        <header className="px-6 py-4 border-b flex justify-between items-center bg-white shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">Presupuesto App</h1>
            <nav>
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Cerrar sesión
                    </button>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Iniciar sesión
                    </button>
                )}
            </nav>
        </header>
    );
}