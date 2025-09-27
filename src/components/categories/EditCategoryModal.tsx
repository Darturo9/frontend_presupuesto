'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateCategory, Category, UpdateCategoryDto } from '@/lib/api/categories';

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: Category | null;
}

export default function EditCategoryModal({ isOpen, onClose, onSuccess, category }: EditCategoryModalProps) {
    const [formData, setFormData] = useState<UpdateCategoryDto>({
        name: '',
        description: '',
        type: 'expense'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Llenar el formulario cuando se abre el modal con una categoría
    useEffect(() => {
        if (isOpen && category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                type: category.type
            });
            setErrors({});
        }
    }, [isOpen, category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category) return;

        // Validaciones básicas
        const newErrors: Record<string, string> = {};
        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        if (formData.name && formData.name.length > 100) {
            newErrors.name = 'El nombre no puede exceder 100 caracteres';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);
            await updateCategory(category.id, {
                ...formData,
                description: formData.description?.trim() || undefined
            });

            setErrors({});
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating category:', error);
            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Error al actualizar la categoría' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                name: '',
                description: '',
                type: 'expense'
            });
            setErrors({});
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Editar Categoría">
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {errors.general}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Comida, Transporte, Salario..."
                        disabled={loading}
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descripción opcional..."
                        rows={3}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                    </label>
                    <select
                        value={formData.type || 'expense'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'expense' | 'income' }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="expense">Gasto</option>
                        <option value="income">Ingreso</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Actualizando...
                            </span>
                        ) : (
                            '📝 Actualizar Categoría'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}