'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/lib/hooks/useAuth';
import SidebarItem from './SidebarItem';
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';

export default function Sidebar() {
    const { isOpen, close } = useSidebar();
    const { user, logout: authLogout, session } = useAuth();
    const pathname = usePathname();

    const handleLogout = async () => {
        console.log('🚀 LOGOUT desde Sidebar: Iniciando...');

        // PASO 1: Activar forceLogout en el hook
        await authLogout();

        // PASO 2: Cerrar sesión de NextAuth si existe
        if (session) {
            console.log('🔴 Cerrando sesión de NextAuth...');
            await signOut({ redirect: false });
        }

        // PASO 3: Borrar cookies agresivamente
        console.log('🧹 Limpiando cookies...');
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' });
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // PASO 4: Limpiar storage
        console.log('🗑️ Limpiando storage...');
        localStorage.clear();
        sessionStorage.clear();

        console.log('✅ Logout completo, redirigiendo...');

        // PASO 5: Redirigir
        window.location.replace('/login');
    };

    const menuItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            label: 'Dashboard',
            href: '/dashboard'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            label: 'Transacciones',
            href: '/dashboard/transactions'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            label: 'Configurar Perfil',
            href: '/dashboard/profile'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            label: 'Gestionar Categorías',
            href: '/dashboard/categories'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            label: 'Exportar Datos',
            href: '/dashboard/export'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            label: 'Gestionar Presupuestos',
            href: '/dashboard/budgets'
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            ),
            label: 'Cerrar Sesión',
            href: '/logout',
            isLogout: true
        }
    ];

    return (
        <>
            {/* Backdrop para mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
            `}>
                {/* Header del sidebar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-8 h-8 rounded-full object-cover"
                            />

                        ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.firstName?.charAt(0) || 'U'}
                                </span>
                            </div>
                        )}
                        <span className="ml-3 text-lg font-semibold text-gray-800">Presupuesto</span>
                    </div>

                    {/* Botón cerrar en mobile */}
                    <button
                        onClick={close}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 flex-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                            isActive={pathname === item.href}
                            isLogout={item.isLogout}
                            onClick={() => {
                                if (item.isLogout) {
                                    handleLogout();
                                }
                                // Cerrar sidebar en mobile al hacer click
                                if (window.innerWidth < 1024) {
                                    close();
                                }
                            }}
                        />
                    ))}
                </nav>
            </div>
        </>
    );
}