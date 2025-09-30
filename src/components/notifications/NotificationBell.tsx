'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { Notification } from '@/lib/notifications';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }

        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'budget_alert':
                return '🚨';
            case 'transaction_reminder':
                return '📝';
            case 'weekly_report':
                return '📊';
            default:
                return '🔔';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-blue-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Hace un momento';
        } else if (diffInHours < 24) {
            return `Hace ${diffInHours}h`;
        } else if (diffInHours < 48) {
            return 'Ayer';
        } else {
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Marcar todas como leídas
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-80">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                Cargando...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                No tienes notificaciones
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                                        !notification.read ? 'bg-blue-50' : 'bg-white'
                                    } hover:bg-gray-50 transition-colors`}
                                >
                                    <div className="p-3">
                                        <div className="flex items-start justify-between">
                                            <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex items-center mb-1">
                                                    <span className="text-lg mr-2">{getNotificationIcon(notification.type)}</span>
                                                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                                                <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                                className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}