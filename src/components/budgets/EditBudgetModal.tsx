'use client';

import { useState, useEffect } from 'react';
import { Budget, updateBudget, UpdateBudgetDto } from '@/lib/budgets';
import { Category, getCategories } from '@/lib/categories';

interface EditBudgetModalProps {
    budget: Budget;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditBudgetModal({ budget, onClose, onSuccess }: EditBudgetModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<UpdateBudgetDto>({
        name: budget.name,
        amount: budget.amount,
        period: budget.period,
        categoryId: budget.category.id
    });
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'El monto debe ser mayor a 0';
        }

        if (!formData.categoryId || formData.categoryId === 0) {
            newErrors.categoryId = 'Debes seleccionar una categoría';
        }

        if (!formData.period) {
            newErrors.period = 'El período es requerido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});
            await updateBudget(budget.id, formData);
            onSuccess();
        } catch (error: any) {
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };

    const generatePeriodOptions = () => {
        const options = [];
        const currentDate = new Date();

        // Generar desde 6 meses atrás hasta 12 meses adelante
        for (let i = -6; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric'
            });
            options.push({ value, label });
        }

        return options;
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Editar Presupuesto</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error general */}
                    {errors.general && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.general}</p>
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del presupuesto *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="ej. Comida Enero 2025"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría *
                        </label>
                        {loadingCategories ? (
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                                <div className="animate-pulse h-5 bg-gray-200 rounded"></div>
                            </div>
                        ) : (
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.categoryId ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value={0}>Selecciona una categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.categoryId && (
                            <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
                        )}
                    </div>

                    {/* Período */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Período *
                        </label>
                        <select
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.period ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            {generatePeriodOptions().map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.period && (
                            <p className="text-sm text-red-600 mt-1">{errors.period}</p>
                        )}
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto del presupuesto *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">Q</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.amount ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="1500.00"
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                        )}
                    </div>

                    {/* Info adicional */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Nota:</strong> Cambiar el período o categoría puede afectar el cálculo de gastos actuales del presupuesto.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || loadingCategories}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}