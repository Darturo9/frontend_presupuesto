'use client';

import { useState, useEffect } from 'react';
import { updateTransaction, UpdateTransactionDto } from '@/lib/api/transactions';
import { getCategories, Category } from '@/lib/api/categories';
import Modal from '../categories/Modal';

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

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: Transaction | null;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transaction
}: EditTransactionModalProps) {
  const [formData, setFormData] = useState<UpdateTransactionDto>({
    amount: 0,
    description: '',
    categoryId: 0
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la transacción cuando se abre el modal
  useEffect(() => {
    if (isOpen && transaction) {
      setFormData({
        amount: transaction.amount,
        description: transaction.description,
        categoryId: transaction.category.id
      });
      fetchCategories(transaction.type);
    }
  }, [isOpen, transaction]);

  const fetchCategories = async (type: 'income' | 'expense') => {
    try {
      setLoadingCategories(true);
      const response = await getCategories({ type, isActive: true });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error al cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) return;

    if (!formData.amount || formData.amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (!formData.description?.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!formData.categoryId) {
      setError('Debe seleccionar una categoría');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Frontend - Editando transacción:', transaction.id, formData);

      await updateTransaction(transaction.id, formData);
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('❌ Frontend - Error updating transaction:', error);
      console.error('❌ Frontend - Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Error al actualizar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: 0,
      description: '',
      categoryId: 0
    });
    setError(null);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(value);
  };

  if (!transaction) return null;

  const title = transaction.type === 'income' ? '💰 Editar Ingreso' : '💸 Editar Gasto';
  const buttonGradient = transaction.type === 'income'
    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Monto *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
              Q
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                amount: parseFloat(e.target.value) || 0
              }))}
              required
            />
          </div>
          {formData.amount && formData.amount > 0 && (
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {formatCurrency(formData.amount)}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Descripción *
          </label>
          <input
            type="text"
            placeholder="Ej: Compra de comestibles"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: e.target.value
            }))}
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Categoría *
          </label>
          {loadingCategories ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
              Cargando categorías...
            </div>
          ) : (
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              value={formData.categoryId || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                categoryId: parseInt(e.target.value)
              }))}
              required
            >
              <option value="" className="text-gray-400">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="text-gray-900">
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {categories.length === 0 && !loadingCategories && (
            <p className="text-sm text-red-600 mt-1 font-medium">
              No hay categorías de {transaction.type === 'income' ? 'ingresos' : 'gastos'} disponibles
            </p>
          )}
        </div>

        {/* Buttons */}
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
            disabled={loading || categories.length === 0}
            className={`px-6 py-2.5 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 ${buttonGradient}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              `${transaction.type === 'income' ? '💰' : '💸'} Guardar Cambios`
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}