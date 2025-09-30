'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';
import { getUserProfile, updateUserProfile, uploadAvatar } from '@/lib/users';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
}

export default function PersonalInfo() {
    const { handleError } = useErrorHandler();
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [editing, setEditing] = useState(false);
    const [originalInfo, setOriginalInfo] = useState<UserInfo | null>(null);

    // Cargar datos del usuario desde el backend
    useEffect(() => {
        const loadUserProfile = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setLoadingProfile(false);
                return;
            }

            try {
                setLoadingProfile(true);
                const userData = await getUserProfile();
                const userInfoData = {
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    avatar: userData.avatar || ''
                };
                setUserInfo(userInfoData);
                setOriginalInfo(userInfoData);
            } catch (error) {
                handleError(error, 'Error al cargar el perfil del usuario');
            } finally {
                setLoadingProfile(false);
            }
        };

        loadUserProfile();
    }, [handleError]);

    const handleInputChange = (field: keyof UserInfo, value: string) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Actualizar perfil en el backend
            await updateUserProfile({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                phone: userInfo.phone
            });

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

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('❌ Por favor selecciona un archivo de imagen válido');
            return;
        }

        // Validar tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ El archivo es demasiado grande. Máximo 5MB');
            return;
        }

        try {
            setUploadingAvatar(true);
            const response = await uploadAvatar(file);

            // Actualizar el estado local con la nueva URL del avatar
            const updatedUserInfo = { ...userInfo, avatar: response.avatarUrl };
            setUserInfo(updatedUserInfo);
            setOriginalInfo(updatedUserInfo);

            alert('✅ Avatar actualizado correctamente');
        } catch (error) {
            handleError(error, 'Error al subir el avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const hasChanges = originalInfo && JSON.stringify(userInfo) !== JSON.stringify(originalInfo);

    if (loadingProfile) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                    <p className="text-sm text-gray-600">Actualiza tu información básica</p>
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
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        {userInfo.avatar ? (
                            <img
                                src={userInfo.avatar}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                                {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                            </div>
                        )}
                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{userInfo.firstName} {userInfo.lastName}</p>
                        <p className="text-sm text-gray-700">{userInfo.email}</p>
                        <div className="mt-1">
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                disabled={uploadingAvatar}
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`text-xs cursor-pointer transition-colors ${
                                    uploadingAvatar
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-blue-600 hover:text-blue-800'
                                }`}
                            >
                                {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto de perfil'}
                            </label>
                        </div>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900"
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
                            disabled={true}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900"
                            placeholder="tu@email.com"
                        />
                        {editing && (
                            <p className="text-xs text-gray-500 mt-1">
                                El email no puede ser modificado por seguridad
                            </p>
                        )}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 bg-white text-gray-900"
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