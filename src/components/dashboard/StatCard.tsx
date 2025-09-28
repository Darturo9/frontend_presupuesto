interface StatCardProps {
  title: string;
  value: number;
  type: 'balance' | 'income' | 'expense';
  isLoading?: boolean;
  onAddTransaction?: () => void;
}

export default function StatCard({ title, value, type, isLoading = false, onAddTransaction }: StatCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  const getColorClasses = () => {
    switch (type) {
      case 'balance':
        if (value > 0) {
          return 'text-green-600 border-green-200 bg-green-50';
        } else if (value === 0) {
          return 'text-gray-600 border-gray-200 bg-gray-50';
        } else {
          return 'text-red-600 border-red-200 bg-red-50';
        }
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
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl" role="img" aria-label={type}>
            {getIcon()}
          </span>
          {/* Botón de agregar solo para ingresos y gastos */}
          {(type === 'income' || type === 'expense') && onAddTransaction && (
            <div className="relative group">
              <button
                onClick={onAddTransaction}
                className={`inline-flex items-center p-1.5 rounded-full text-white transition-colors ${
                  type === 'income'
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {/* Tooltip personalizado */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                Ingresar nuevo {type === 'income' ? 'ingreso' : 'gasto'}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${type === 'balance' && value > 0 ? 'text-green-600' : type === 'balance' && value === 0 ? 'text-gray-600' : type === 'balance' ? 'text-red-600' : type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
        {formatCurrency(value)}
      </p>

      {/* Indicador visual adicional para balance */}
      {type === 'balance' && (
        <div className="mt-2 text-xs sm:text-sm text-gray-500">
          {value > 0 ? '✅ Balance positivo' : value === 0 ? '⚖️ Balance neutro' : '⚠️ Balance negativo'}
        </div>
      )}
    </div>
  );
}