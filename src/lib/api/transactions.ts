import api from '../api';

export interface Transaction {
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

export interface CreateTransactionDto {
  amount: number;
  description: string;
  type: 'income' | 'expense';
  categoryId: number;
}

export interface UpdateTransactionDto {
  amount?: number;
  description?: string;
  categoryId?: number;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  lastPage: number;
}

export interface TransactionsFilters {
  type?: 'income' | 'expense';
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Crear nueva transacción
export const createTransaction = async (transactionData: CreateTransactionDto): Promise<Transaction> => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

// Obtener todas las transacciones con filtros
export const getTransactions = async (filters: TransactionsFilters = {}): Promise<TransactionsResponse> => {
  const params = new URLSearchParams();

  if (filters.type) params.append('type', filters.type);
  if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/transactions?${params.toString()}`);
  return response.data;
};

// Obtener una transacción por ID
export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// Actualizar transacción existente
export const updateTransaction = async (id: number, transactionData: UpdateTransactionDto): Promise<Transaction> => {
  const response = await api.patch(`/transactions/${id}`, transactionData);
  return response.data;
};

// Eliminar transacción
export const deleteTransaction = async (id: number): Promise<{ message: string; id: number }> => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};