import { useState } from 'react';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { useDashboard } from '@/contexts/DashboardContext';
import StatCard from './StatCard';
import CreateTransactionModal from '../transactions/CreateTransactionModal';

interface DashboardStatsProps {
  onTransactionCreated?: () => void;
}

export default function DashboardStats({ onTransactionCreated }: DashboardStatsProps) {
  const { stats, loading, error, refetch } = useDashboardStats();
  const { refreshDashboard } = useDashboard();
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const handleAddIncome = () => {
    setShowIncomeModal(true);
  };

  const handleAddExpense = () => {
    setShowExpenseModal(true);
  };

  const handleModalSuccess = () => {
    refetch(); // Actualizar estadísticas después de crear una transacción
    refreshDashboard(); // Actualizar todo el dashboard (transacciones recientes + gastos por categoría)
    onTransactionCreated?.(); // Callback adicional si se proporciona
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-semibold">Error al cargar estadísticas</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Balance Total"
          value={stats?.balance ?? 0}
          type="balance"
          isLoading={loading}
        />

        <StatCard
          title="Ingresos"
          value={stats?.totalIncome ?? 0}
          type="income"
          isLoading={loading}
          onAddTransaction={handleAddIncome}
        />

        <StatCard
          title="Gastos"
          value={stats?.totalExpenses ?? 0}
          type="expense"
          isLoading={loading}
          onAddTransaction={handleAddExpense}
        />
      </div>

      {/* Modales */}
      <CreateTransactionModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSuccess={handleModalSuccess}
        type="income"
      />

      <CreateTransactionModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSuccess={handleModalSuccess}
        type="expense"
      />
    </>
  );
}