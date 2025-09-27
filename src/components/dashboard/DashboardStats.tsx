import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import StatCard from './StatCard';

export default function DashboardStats() {
  const { stats, loading, error, refetch } = useDashboardStats();

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
      />

      <StatCard
        title="Gastos"
        value={stats?.totalExpenses ?? 0}
        type="expense"
        isLoading={loading}
      />
    </div>
  );
}