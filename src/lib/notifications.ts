import api from "./api";

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'budget_alert' | 'transaction_reminder' | 'weekly_report' | 'system';
    priority: 'low' | 'medium' | 'high';
    read: boolean;
    metadata?: any;
    actionUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export async function getNotifications(limit: number = 50): Promise<Notification[]> {
    try {
        const res = await api.get(`/notifications?limit=${limit}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener las notificaciones');
    }
}

export async function getUnreadCount(): Promise<number> {
    try {
        const res = await api.get('/notifications/unread-count');
        return res.data.count;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener el conteo de notificaciones');
    }
}

export async function markAsRead(notificationId: number): Promise<void> {
    try {
        await api.post(`/notifications/${notificationId}/mark-read`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al marcar como leída');
    }
}

export async function markAllAsRead(): Promise<void> {
    try {
        await api.post('/notifications/mark-all-read');
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al marcar todas como leídas');
    }
}

export async function deleteNotification(notificationId: number): Promise<void> {
    try {
        await api.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al eliminar la notificación');
    }
}