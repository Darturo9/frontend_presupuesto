'use client';

import { useState, useEffect } from 'react';
import { getExpensesByCategory } from '@/lib/api';
import { useDashboard } from '@/contexts/DashboardContext';

interface CategoryExpense {
    category: string;
    amount: number;
}

export default function ExpensesByCategory() {
    const { refreshKey } = useDashboard();
    const [expenses, setExpenses] = useState<CategoryExpense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setLoading(true);
                const data = await getExpensesByCategory();
                setExpenses(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching expenses by category:', err);
                setError('Error al cargar los gastos por categoría');
                setExpenses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [refreshKey]);

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
        }).format(amount);
    };

    const getTotalAmount = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const getPercentage = (amount: number) => {
        const total = getTotalAmount();
        return total > 0 ? ((amount / total) * 100).toFixed(1) : '0';
    };

    const getBarColors = () => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-red-500',
            'bg-indigo-500',
            'bg-pink-500',
            'bg-gray-500',
        ];
        return colors;
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Gastos por Categoría
                </h3>
                <div className="animate-pulse space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-gray-300 h-3 rounded-full w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Gastos por Categoría
                </h3>
                <div className="text-red-500 text-center py-4">
                    {error}
                </div>
            </div>
        );
    }

    if (expenses.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Gastos por Categoría
                </h3>
                <div className="text-gray-500 text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No hay gastos registrados</p>
                    <p className="text-sm mt-1">Agrega gastos para ver el desglose por categoría</p>
                </div>
            </div>
        );
    }

    const colors = getBarColors();
    const totalAmount = getTotalAmount();

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Gastos por Categoría
            </h3>

            {/* Total */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total de gastos</p>
                <p className="text-2xl font-bold text-gray-800">
                    {formatAmount(totalAmount)}
                </p>
            </div>

            {/* Lista de categorías con barras */}
            <div className="space-y-4">
                {expenses.map((expense, index) => {
                    const percentage = getPercentage(expense.amount);
                    const colorClass = colors[index % colors.length];

                    return (
                        <div key={expense.category} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {expense.category}
                                </span>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {formatAmount(expense.amount)}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({percentage}%)
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${colorClass} h-2 rounded-full transition-all duration-300 ease-out`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leyenda de colores */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    {expenses.slice(0, 6).map((expense, index) => {
                        const colorClass = colors[index % colors.length];
                        return (
                            <div key={expense.category} className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                                <span className="text-gray-600 truncate">
                                    {expense.category}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}