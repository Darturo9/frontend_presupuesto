'use client';

import { useState } from 'react';
import { Category } from '@/lib/categories';
import { createBudget, CreateBudgetDto } from '@/lib/budgets';

interface CreateBudgetModalProps {
    categories: Category[];
    defaultPeriod: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateBudgetModal({ categories, defaultPeriod, onClose, onSuccess }: CreateBudgetModalProps) {
    const [formData, setFormData] = useState<CreateBudgetDto>({
        name: '',
        amount: 0,
        period: defaultPeriod,
        categoryId: 0
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (formData.amount <= 0) {
            newErrors.amount = 'El monto debe ser mayor a 0';
        }

        if (formData.categoryId === 0) {
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
            await createBudget(formData);
            onSuccess();
        } catch (error: any) {
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };

    const formatPeriod = (period: string) => {
        const [year, month] = period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
    };

    const generatePeriodOptions = () => {
        const options = [];
        const currentDate = new Date();

        // Generar los próximos 12 meses
        for (let i = 0; i < 12; i++) {
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
                    <h2 className="text-lg font-semibold text-gray-900">Crear Nuevo Presupuesto</h2>
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
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Nombre del presupuesto *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
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
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Categoría *
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                                errors.categoryId ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value={0}>Selecciona una categoría</option>
                            {categories && Array.isArray(categories) && categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
                        )}
                    </div>

                    {/* Período */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Período *
                        </label>
                        <select
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
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
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Monto del presupuesto *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-700 text-sm font-medium">Q</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
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
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Recordatorio:</strong> Recibirás notificaciones cuando alcances el 75% y 90% de tu presupuesto.
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
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Presupuesto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}