'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/dashboard/DashboardLayout';

function BudgetsContent() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Gestionar Presupuestos</h1>
                <p className="text-gray-600">Controla y supervisa tus presupuestos por categoría</p>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="max-w-md mx-auto">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Próximamente...
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Estamos trabajando en esta funcionalidad para que puedas crear y gestionar presupuestos personalizados por categoría.
                    </p>

                    {/* Features List */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Funcionalidades que estarán disponibles:</h3>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Crear presupuestos por categoría</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Establecer límites mensuales</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Alertas automáticas de gastos</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Seguimiento de progreso visual</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-700">Comparación entre períodos</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-center">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3 text-left">
                                <p className="text-sm text-orange-800">
                                    <strong>¿Quieres ayuda con presupuestos?</strong> Mientras tanto puedes revisar tus transacciones para analizar tus gastos.
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
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Ver Transacciones</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Mientras tanto, puedes revisar y analizar todas tus transacciones para entender tus patrones de gasto.
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
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Gestionar Categorías</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Organiza tus gastos creando y administrando categorías personalizadas para mejor control.
                    </p>
                    <a
                        href="/dashboard/categories"
                        className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                        Ir a Categorías
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function BudgetsPage() {
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
            <BudgetsContent />
        </DashboardLayout>
    );
}