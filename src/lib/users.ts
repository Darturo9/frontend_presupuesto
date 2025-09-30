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

export async function getUserProfile() {
    try {
        const res = await api.get('/users/me');
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener el perfil del usuario');
    }
}

export async function updateUserProfile(data: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
    try {
        const res = await api.patch('/users/me', data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el perfil del usuario');
    }
}

export async function uploadAvatar(file: File) {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const res = await api.post('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al subir el avatar');
    }
}

export async function getUserSettings() {
    try {
        const res = await api.get('/users/me/settings');
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener la configuración del usuario');
    }
}

export async function updateUserSettings(data: {
    currency?: string;
    dateFormat?: string;
    language?: string;
    monthlyBudgetLimit?: number;
    budgetAlerts?: boolean;
    transactionReminders?: boolean;
    weeklyReports?: boolean;
}) {
    try {
        const res = await api.patch('/users/me/settings', data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar la configuración del usuario');
    }
}

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    try {
        const res = await api.post('/users/me/change-password', data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
}

export async function deleteAccount(data: {
    password?: string;
    confirmation: string;
}) {
    try {
        const res = await api.delete('/users/me', { data });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar la cuenta');
    }
}