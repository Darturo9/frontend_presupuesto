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
        // Manejar errores de rate limiting (429)
        if (error.response?.status === 429) {
            const errorData = error.response.data;

            // Crear un mensaje amigable
            const message = errorData.message || 'Demasiadas solicitudes';
            const details = errorData.details || 'Intenta de nuevo en unos momentos';

            // Mostrar notificación toast (opcional)
            if (typeof window !== 'undefined') {
                // Puedes usar una librería de toast aquí
                console.warn(`⚠️ Rate Limit: ${message}. ${details}`);
            }

            // Crear un error personalizado con información útil
            const customError = new Error(message);
            (customError as any).isRateLimit = true;
            (customError as any).details = details;
            (customError as any).retryAfter = error.response.headers['retry-after'] || 60;

            return Promise.reject(customError);
        }

        // Manejar otros errores
        if (error.response?.status === 401) {
            // Token expirado o inválido
            if (typeof window !== 'undefined') {
                Cookies.remove('token');
                window.location.href = '/';
            }
        }

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