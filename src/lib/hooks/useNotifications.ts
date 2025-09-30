import { useState, useEffect, useCallback } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, Notification } from '@/lib/notifications';
import Cookies from 'js-cookie';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async () => {
        const token = Cookies.get('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const [notificationsData, countData] = await Promise.all([
                getNotifications(50),
                getUnreadCount()
            ]);

            setNotifications(notificationsData);
            setUnreadCount(countData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar notificaciones');
        } finally {
            setLoading(false);
        }
    }, []);

    const markNotificationAsRead = useCallback(async (notificationId: number) => {
        try {
            await markAsRead(notificationId);

            // Actualizar estado local
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );

            // Decrementar contador si no estaba leída
            const notification = notifications.find(n => n.id === notificationId);
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al marcar como leída');
        }
    }, [notifications]);

    const markAllNotificationsAsRead = useCallback(async () => {
        try {
            await markAllAsRead();

            // Actualizar estado local
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al marcar todas como leídas');
        }
    }, []);

    const removeNotification = useCallback(async (notificationId: number) => {
        try {
            await deleteNotification(notificationId);

            // Actualizar estado local
            const notification = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            // Decrementar contador si no estaba leída
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar notificación');
        }
    }, [notifications]);

    const refreshNotifications = useCallback(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Polling para actualizaciones en tiempo real (cada 30 segundos)
    useEffect(() => {
        const interval = setInterval(() => {
            const token = Cookies.get('token');
            if (token) {
                getUnreadCount().then(setUnreadCount).catch(() => {});
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead: markNotificationAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        deleteNotification: removeNotification,
        refresh: refreshNotifications
    };
}