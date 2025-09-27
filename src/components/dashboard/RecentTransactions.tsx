'use client';

import { useState, useEffect } from 'react';
import { getRecentTransactions } from '@/lib/api';

interface Transaction {
    id: number;
    amount: number;
    description: string;
    type: 'income' | 'expense';
    category: {
        id: number;
        name: string;
    };
    createdAt: string;
}

export default function RecentTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const data = await getRecentTransactions();
                setTransactions(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching recent transactions:', err);
                setError('Error al cargar las transacciones recientes');
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatAmount = (amount: number, type: 'income' | 'expense') => {
        const formatted = new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
        }).format(amount);

        return type === 'income' ? `+${formatted}` : `-${formatted}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-GT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Transacciones Recientes
                </h3>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div>
                                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
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
                    Transacciones Recientes
                </h3>
                <div className="text-red-500 text-center py-4">
                    {error}
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Transacciones Recientes
                </h3>
                <div className="text-gray-500 text-center py-8">
                    <div className="text-4xl mb-2">💳</div>
                    <p>No hay transacciones recientes</p>
                    <p className="text-sm mt-1">Agrega tu primera transacción para comenzar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Transacciones Recientes
            </h3>
            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                transaction.type === 'income'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                            }`}>
                                {transaction.type === 'income' ? '+' : '-'}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                    {transaction.description}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                    <span>{transaction.category.name}</span>
                                    <span>•</span>
                                    <span>{formatDate(transaction.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`font-semibold ${
                            transaction.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                        }`}>
                            {formatAmount(transaction.amount, transaction.type)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}