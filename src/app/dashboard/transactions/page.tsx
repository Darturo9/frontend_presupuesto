'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getTransactions, deleteTransaction, TransactionsFilters } from '@/lib/api/transactions';
import { getCategories, Category } from '@/lib/api/categories';
import CreateTransactionModal from '@/components/transactions/CreateTransactionModal';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';

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

export default function TransactionsPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Estados principales
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtros
    const [filters, setFilters] = useState<TransactionsFilters>({
        page: 1,
        limit: 10
    });

    // Modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [deleting, setDeleting] = useState(false);

    // Autenticación
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

    // Cargar datos iniciales
    useEffect(() => {
        if (isAuthenticated) {
            fetchTransactions();
            fetchCategories();
        }
    }, [isAuthenticated, filters]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching transactions with filters:', filters);
            const response = await getTransactions(filters);
            console.log('🔍 Full API response:', response);
            console.log('🔍 Response.data:', response?.data);
            console.log('🔍 Response type:', typeof response);

            // Verificar si response.data existe y es un array
            if (response && response.data && Array.isArray(response.data)) {
                setTransactions(response.data);
                setTotalPages(response.lastPage || 1);
                setCurrentPage(response.page || 1);
            } else {
                console.warn('⚠️ Response format unexpected:', response);
                setTransactions([]);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('❌ Error fetching transactions:', error);
            setTransactions([]);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories({ isActive: true });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleFilterChange = (newFilters: Partial<TransactionsFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1
        }));
    };

    const handlePageChange = (page: number) => {
        handleFilterChange({ page });
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowEditModal(true);
    };

    const handleDeleteClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTransaction) return;

        setDeleting(true);
        try {
            await deleteTransaction(selectedTransaction.id);
            setShowDeleteModal(false);
            setSelectedTransaction(null);
            fetchTransactions(); // Refrescar lista
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Error al eliminar la transacción');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedTransaction(null);
    };

    const handleCreateTransaction = (type: 'income' | 'expense') => {
        setTransactionType(type);
        setShowCreateModal(true);
    };

    const handleModalSuccess = () => {
        fetchTransactions(); // Refrescar lista después de crear/editar
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
        }).format(amount);
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

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="text-lg">Redirigiendo al inicio...</div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Todas las Transacciones</h1>
                        <p className="text-gray-600">Administra todos tus ingresos y gastos</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleCreateTransaction('income')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nuevo Ingreso
                        </button>
                        <button
                            onClick={() => handleCreateTransaction('expense')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                            Nuevo Gasto
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Filtro por tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.type || ''}
                                onChange={(e) => handleFilterChange({ type: e.target.value as 'expense' | 'income' || undefined })}
                            >
                                <option value="">Todos</option>
                                <option value="income">Ingresos</option>
                                <option value="expense">Gastos</option>
                            </select>
                        </div>

                        {/* Filtro por categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.categoryId || ''}
                                onChange={(e) => handleFilterChange({ categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
                            >
                                <option value="">Todas</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro fecha inicio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.startDate || ''}
                                onChange={(e) => handleFilterChange({ startDate: e.target.value || undefined })}
                            />
                        </div>

                        {/* Filtro fecha fin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filters.endDate || ''}
                                onChange={(e) => handleFilterChange({ endDate: e.target.value || undefined })}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla de transacciones */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="text-lg">Cargando transacciones...</div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descripción
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Categoría
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Monto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transactions && transactions.length > 0 ? transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(transaction.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {transaction.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        transaction.type === 'income'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => handleEditTransaction(transaction)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(transaction)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                    {loading ? 'Cargando transacciones...' : 'No hay transacciones para mostrar'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage <= 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Página <span className="font-medium">{currentPage}</span> de{' '}
                                                <span className="font-medium">{totalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage <= 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Anterior
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const page = i + 1;
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                page === currentPage
                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage >= totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Siguiente
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Mensaje si no hay transacciones */}
                {!loading && transactions.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <div className="text-gray-500">
                            <div className="text-4xl mb-2">💳</div>
                            <p className="text-lg font-medium">No hay transacciones</p>
                            <p className="mt-1">Agrega tu primera transacción para comenzar</p>
                        </div>
                    </div>
                )}

                {/* Modales */}
                <CreateTransactionModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleModalSuccess}
                    type={transactionType}
                />

                <EditTransactionModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleModalSuccess}
                    transaction={selectedTransaction}
                />

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Eliminar Transacción"
                    message={`¿Estás seguro de que deseas eliminar la transacción "${selectedTransaction?.description}"?`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    type="danger"
                    loading={deleting}
                />
            </div>
        </DashboardLayout>
    );
}