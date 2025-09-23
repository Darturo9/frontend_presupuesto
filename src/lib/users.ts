import api from "./api";
import { RegisterData } from "@/types/auth";

export async function register(data: RegisterData) {
    try {
        const res = await api.post('/users', data);
        return res.data;
    } catch (error: any) {
        // Puedes personalizar el mensaje según la respuesta del backend
        throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
}

export async function login(email: string, password: string) {
    try {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }

}

export async function loginGoogle(data: { email: string; googleId: string; firstName?: string; lastName?: string; avatar?: string }) {
    try {
        const res = await api.post('/auth/google', data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión con Google');
    }
}