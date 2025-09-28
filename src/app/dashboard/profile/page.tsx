'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PersonalInfo from '@/components/profile/PersonalInfo';
import SecuritySettings from '@/components/profile/SecuritySettings';
import AppSettings from '@/components/profile/AppSettings';

export default function ProfilePage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Autenticación
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="text-lg">Redirigiendo al inicio...</div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Configuración de Perfil</h1>
                    <p className="text-gray-600">Administra tu información personal y configuración de la aplicación</p>
                </div>

                {/* Grid de secciones */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Información Personal */}
                    <div className="space-y-6">
                        <PersonalInfo />
                        <SecuritySettings />
                    </div>

                    {/* Configuración de la App */}
                    <div className="space-y-6">
                        <AppSettings />

                        {/* Sección de ayuda */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-blue-900">
                                        ¿Necesitas ayuda?
                                    </h3>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Si tienes problemas con tu cuenta o necesitas asistencia, contáctanos.
                                    </p>
                                    <div className="mt-3">
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                            Contactar soporte →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}