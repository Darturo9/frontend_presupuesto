'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/dashboard/DashboardLayout';

function ExportContent() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Exportar Datos</h1>
                <p className="text-gray-600">Descarga tus datos financieros en diferentes formatos</p>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="max-w-md mx-auto">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Próximamente...
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Estamos trabajando en esta funcionalidad para que puedas exportar tus datos financieros en formatos como CSV, Excel y PDF.
                    </p>

                    {/* Features List */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Funcionalidades que estarán disponibles:</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Exportar transacciones en CSV y Excel</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Reportes de presupuestos en PDF</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Resumen financiero mensual</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Gráficos y estadísticas visuales</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Filtros por fecha y categoría</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-center">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3 text-left">
                                <p className="text-sm text-blue-800">
                                    <strong>¿Necesitas tus datos ahora?</strong> Puedes contactar a soporte para obtener un reporte personalizado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alternative Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Ver Transacciones</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Mientras tanto, puedes revisar todas tus transacciones en la sección correspondiente.
                    </p>
                    <a
                        href="/dashboard/transactions"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Ir a Transacciones
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Gestionar Presupuestos</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Revisa y administra tus presupuestos para mantener un mejor control financiero.
                    </p>
                    <a
                        href="/dashboard/budgets"
                        className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800"
                    >
                        Ir a Presupuestos
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ExportPage() {
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
            <DashboardLayout>
                <div className="p-8 flex justify-center items-center">
                    <div className="text-lg">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!isAuthenticated) {
        return (
            <DashboardLayout>
                <div className="p-8 flex justify-center items-center">
                    <div className="text-lg">Redirigiendo al inicio...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <ExportContent />
        </DashboardLayout>
    );
}