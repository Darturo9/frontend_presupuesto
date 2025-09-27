'use client';

import { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import Sidebar from './Sidebar';
import LogoutButton from '@/components/auth/LogoutButton';

interface DashboardLayoutProps {
    children: ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
    const { toggle } = useSidebar();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Top header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        {/* Botón hamburguesa para mobile */}
                        <button
                            onClick={toggle}
                            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Título de la página */}
                        <h1 className="text-xl font-semibold text-gray-800 ml-2 lg:ml-0">
                            Dashboard
                        </h1>
                    </div>

                    {/* Botón logout */}
                    <div className="flex items-center space-x-4">
                        <LogoutButton />
                    </div>
                </header>

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </SidebarProvider>
    );
}