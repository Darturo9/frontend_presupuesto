import api from "./api";

export interface Budget {
    id: number;
    name: string;
    amount: number;
    period: string;
    category: {
        id: number;
        name: string;
        icon: string;
        color: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface BudgetStatus {
    budgetId: number;
    name: string;
    category: string;
    period: string;
    amount: number;
    spent: number;
    available: number;
}

export interface CreateBudgetDto {
    name: string;
    amount: number;
    period: string;
    categoryId: number;
}

export interface UpdateBudgetDto {
    name?: string;
    amount?: number;
    period?: string;
    categoryId?: number;
}

export async function getBudgets(filters: {
    period?: string;
    categoryId?: number;
} = {}): Promise<Budget[]> {
    try {
        const params = new URLSearchParams();
        if (filters.period) params.append('period', filters.period);
        if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());

        const res = await api.get(`/budgets?${params.toString()}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener presupuestos');
    }
}

export async function getBudget(id: number): Promise<Budget> {
    try {
        const res = await api.get(`/budgets/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener presupuesto');
    }
}

export async function getBudgetStatus(id: number): Promise<BudgetStatus> {
    try {
        const res = await api.get(`/budgets/${id}/status`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener estado del presupuesto');
    }
}

export async function createBudget(budgetData: CreateBudgetDto): Promise<Budget> {
    try {
        const res = await api.post('/budgets', budgetData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al crear presupuesto');
    }
}

export async function updateBudget(id: number, budgetData: UpdateBudgetDto): Promise<Budget> {
    try {
        const res = await api.put(`/budgets/${id}`, budgetData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar presupuesto');
    }
}

export async function deleteBudget(id: number): Promise<void> {
    try {
        await api.delete(`/budgets/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar presupuesto');
    }
}