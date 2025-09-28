'use client';

import { useState, useEffect } from 'react';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export default function PersonalInfo() {
    const { handleError } = useErrorHandler();
    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [originalInfo, setOriginalInfo] = useState<UserInfo | null>(null);

    // Simular carga de datos del usuario (después conectaremos con el backend)
    useEffect(() => {
        // TODO: Implementar llamada al backend para obtener datos del usuario
        const mockUserData = {
            firstName: 'Usuario',
            lastName: 'Demo',
            email: 'usuario@example.com',
            phone: ''
        };
        setUserInfo(mockUserData);
        setOriginalInfo(mockUserData);
    }, []);

    const handleInputChange = (field: keyof UserInfo, value: string) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // TODO: Implementar llamada al backend para actualizar usuario
            console.log('Guardando información del usuario:', userInfo);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOriginalInfo(userInfo);
            setEditing(false);
            alert('✅ Información actualizada correctamente');

        } catch (error) {
            handleError(error, 'Error al actualizar la información');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (originalInfo) {
            setUserInfo(originalInfo);
        }
        setEditing(false);
    };

    const hasChanges = originalInfo && JSON.stringify(userInfo) !== JSON.stringify(originalInfo);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información Personal</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Actualiza tu información básica</p>
                </div>
                <div className="flex items-center space-x-2">
                    {editing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !hasChanges}
                                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                        >
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {/* Avatar placeholder */}
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                        {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{userInfo.firstName} {userInfo.lastName}</p>
                        <p className="text-sm text-gray-700">{userInfo.email}</p>
                        {editing && (
                            <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                                Cambiar foto de perfil
                            </button>
                        )}
                    </div>
                </div>

                {/* Formulario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            value={userInfo.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Tu nombre"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            value={userInfo.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Tu apellido"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            Correo electrónico *
                        </label>
                        <input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="tu@email.com"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1">
                            Teléfono (opcional)
                        </label>
                        <input
                            type="tel"
                            value={userInfo.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="+502 1234-5678"
                        />
                    </div>
                </div>

                {editing && hasChanges && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Tienes cambios sin guardar
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}