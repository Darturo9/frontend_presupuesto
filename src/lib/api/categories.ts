import api from '../api';

export interface Category {
    id: number;
    name: string;
    description: string;
    type: 'expense' | 'income';
    isActive: boolean;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
    type: 'expense' | 'income';
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    type?: 'expense' | 'income';
    isActive?: boolean;
}

export interface CategoriesResponse {
    data: Category[];
    total: number;
    page: number;
    lastPage: number;
}

export interface CategoriesFilters {
    type?: 'expense' | 'income';
    isActive?: boolean;
    page?: number;
    limit?: number;
    name?: string;
}

// Obtener todas las categorías con filtros
export const getCategories = async (filters: CategoriesFilters = {}): Promise<CategoriesResponse> => {
    const params = new URLSearchParams();

    if (filters.type) params.append('type', filters.type);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.name) params.append('name', filters.name);

    const response = await api.get(`/categories?${params.toString()}`);
    return response.data;
};

// Obtener una categoría por ID
export const getCategory = async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

// Crear nueva categoría
export const createCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

// Actualizar categoría existente
export const updateCategory = async (id: number, categoryData: UpdateCategoryDto): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
};

// Soft delete (desactivar) categoría
export const deleteCategory = async (id: number): Promise<{ message: string; id: number }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

// Reactivar categoría
export const reactivateCategory = async (id: number): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, { isActive: true });
    return response.data;
};