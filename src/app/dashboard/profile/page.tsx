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
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}