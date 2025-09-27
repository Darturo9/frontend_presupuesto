interface StatCardProps {
  title: string;
  value: number;
  type: 'balance' | 'income' | 'expense';
  isLoading?: boolean;
}

export default function StatCard({ title, value, type, isLoading = false }: StatCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  const getColorClasses = () => {
    switch (type) {
      case 'balance':
        return value >= 0
          ? 'text-green-600 border-green-200 bg-green-50'
          : 'text-red-600 border-red-200 bg-red-50';
      case 'income':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'expense':
        return 'text-red-600 border-red-200 bg-red-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'balance':
        return value >= 0 ? '📈' : '📉';
      case 'income':
        return '💰';
      case 'expense':
        return '💸';
      default:
        return '📊';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow border animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-20 sm:w-24"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 rounded-lg shadow border-l-4 ${getColorClasses()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700 text-xs sm:text-sm uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xl sm:text-2xl" role="img" aria-label={type}>
          {getIcon()}
        </span>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${type === 'balance' && value >= 0 ? 'text-green-600' : type === 'balance' ? 'text-red-600' : type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
        {formatCurrency(value)}
      </p>

      {/* Indicador visual adicional para balance */}
      {type === 'balance' && (
        <div className="mt-2 text-xs sm:text-sm text-gray-500">
          {value >= 0 ? '✅ Balance positivo' : '⚠️ Balance negativo'}
        </div>
      )}
    </div>
  );
}