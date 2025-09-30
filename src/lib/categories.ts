import api from "./api";

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
    description?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    type?: 'income' | 'expense';
    icon?: string;
    color?: string;
    description?: string;
}

export async function getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
    try {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        // Establecer un límite alto para obtener todas las categorías
        params.append('limit', '100');

        const res = await api.get(`/categories?${params.toString()}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener categorías');
    }
}

export async function getCategory(id: number): Promise<Category> {
    try {
        const res = await api.get(`/categories/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener categoría');
    }
}

export async function createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    try {
        const res = await api.post('/categories', categoryData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al crear categoría');
    }
}

export async function updateCategory(id: number, categoryData: UpdateCategoryDto): Promise<Category> {
    try {
        const res = await api.put(`/categories/${id}`, categoryData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar categoría');
    }
}

export async function deleteCategory(id: number): Promise<void> {
    try {
        await api.delete(`/categories/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar categoría');
    }
}