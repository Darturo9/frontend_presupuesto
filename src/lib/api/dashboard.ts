import api from '../api';

// Interfaces para las respuestas
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  createdAt: string;
  category: {
    id: number;
    name: string;
    type: 'income' | 'expense';
  };
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

// Funciones para obtener datos del dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<DashboardStats>('/transactions/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw new Error('No se pudieron cargar las estadísticas');
  }
};

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get<Transaction[]>('/transactions/dashboard/recent');
    return response.data;
  } catch (error) {
    console.error('Error al obtener transacciones recientes:', error);
    throw new Error('No se pudieron cargar las transacciones recientes');
  }
};

export const getExpensesByCategory = async (): Promise<ExpenseByCategory[]> => {
  try {
    const response = await api.get<ExpenseByCategory[]>('/transactions/dashboard/expenses-by-category');
    return response.data;
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    throw new Error('No se pudieron cargar los gastos por categoría');
  }
};

// Función helper para obtener todos los datos del dashboard de una vez
export const getDashboardData = async () => {
  try {
    const [stats, recentTransactions, expensesByCategory] = await Promise.all([
      getDashboardStats(),
      getRecentTransactions(),
      getExpensesByCategory(),
    ]);

    return {
      stats,
      recentTransactions,
      expensesByCategory,
    };
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    throw new Error('No se pudieron cargar los datos del dashboard');
  }
};