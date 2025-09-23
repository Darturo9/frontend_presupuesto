import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Usa variable de entorno
    // Puedes agregar más configuración aquí (headers, timeout, etc.)
});

export default api;