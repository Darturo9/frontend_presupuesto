import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Cambia por la URL de tu backend NestJS
    // Puedes agregar más configuración aquí (headers, timeout, etc.)
});

export default api;