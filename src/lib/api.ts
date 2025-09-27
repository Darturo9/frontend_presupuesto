import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // Puedes agregar más configuración aquí (headers, timeout, etc.)
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

// Funciones para el dashboard
export const getDashboardStats = async () => {
    const response = await api.get('/transactions/dashboard/stats');
    return response.data;
};

export const getRecentTransactions = async () => {
    const response = await api.get('/transactions/dashboard/recent');
    return response.data;
};

export const getExpensesByCategory = async () => {
    const response = await api.get('/transactions/dashboard/expenses-by-category');
    return response.data;
};

export default api;