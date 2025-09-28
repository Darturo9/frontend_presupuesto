'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions, { RecentTransactionsRef } from '@/components/dashboard/RecentTransactions';
import ExpensesByCategory from '@/components/dashboard/ExpensesByCategory';

export default function DashboardPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const recentTransactionsRef = useRef<RecentTransactionsRef>(null);

    // Redirigir al home si no está autenticado
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

    // Si está cargando, mostrar spinner
    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="text-lg">Cargando dashboard...</div>
            </div>
        );
    }

    // Si no está autenticado, mostrar mensaje de redirección
    if (!isAuthenticated) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="text-lg">Redirigiendo al inicio...</div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            {/* Saludo de bienvenida */}
            <div className="mb-8">
                {user && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Bienvenido, {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-gray-600">
                            Aquí tienes un resumen de tu actividad financiera
                        </p>
                    </div>
                )}
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="mb-8">
                <DashboardStats onTransactionCreated={() => recentTransactionsRef.current?.refetch()} />
            </div>

            {/* Componentes principales del dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Transacciones recientes */}
                <div className="order-1 xl:order-1">
                    <RecentTransactions ref={recentTransactionsRef} />
                </div>

                {/* Gastos por categoría */}
                <div className="order-2 xl:order-2">
                    <ExpensesByCategory />
                </div>
            </div>

        </DashboardLayout>
    );
}