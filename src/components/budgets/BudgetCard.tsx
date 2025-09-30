'use client';

import { useState } from 'react';
import { Budget } from '@/lib/budgets';
import { deleteBudget } from '@/lib/budgets';
import EditBudgetModal from './EditBudgetModal';

interface BudgetCardProps {
    budget: Budget & {
        spent: number;
        available: number;
        percentage: number;
    };
    onUpdate: () => void;
    statusColor: 'green' | 'yellow' | 'red';
}

export default function BudgetCard({ budget, onUpdate, statusColor }: BudgetCardProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getProgressBarColor = () => {
        switch (statusColor) {
            case 'green': return 'bg-green-400';
            case 'yellow': return 'bg-orange-400';
            case 'red': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    const getBorderColor = () => {
        switch (statusColor) {
            case 'green': return 'border-green-200';
            case 'yellow': return 'border-yellow-200';
            case 'red': return 'border-red-200';
            default: return 'border-gray-200';
        }
    };

    const getStatusIcon = () => {
        switch (statusColor) {
            case 'green':
                return (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'yellow':
                return (
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            case 'red':
                return (
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteBudget(budget.id);
            onUpdate();
            setShowDeleteModal(false);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setDeleting(false);
        }
    };

    const getDaysRemaining = () => {
        const [year, month] = budget.period.split('-');
        const endOfMonth = new Date(parseInt(year), parseInt(month), 0);
        const today = new Date();
        const diffTime = endOfMonth.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3"
                            style={{ backgroundColor: budget.category.color }}
                        >
                            {budget.category.icon}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{budget.name}</h3>
                            <p className="text-sm text-gray-500">{budget.category.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        {getStatusIcon()}
                        <div className="relative">
                            <button
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Toggle dropdown menu
                                }}
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso</span>
                        <span className={`font-medium ${
                            statusColor === 'red' ? 'text-red-500' :
                            statusColor === 'yellow' ? 'text-orange-500' :
                            'text-green-500'
                        }`}>
                            {budget.percentage}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getProgressBarColor()}`}
                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Amounts */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gastado:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(budget.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Presupuesto:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(budget.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-gray-600">
                            {budget.available >= 0 ? 'Disponible:' : 'Excedido:'}
                        </span>
                        <span className={`font-medium ${
                            budget.available >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {formatCurrency(Math.abs(budget.available))}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-gray-500">
                        {getDaysRemaining()} días restantes
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-3 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de editar */}
            {showEditModal && (
                <EditBudgetModal
                    budget={budget}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        onUpdate();
                    }}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">Eliminar Presupuesto</h3>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            ¿Estás seguro de que quieres eliminar el presupuesto "{budget.name}"?
                            Esta acción no se puede deshacer.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}