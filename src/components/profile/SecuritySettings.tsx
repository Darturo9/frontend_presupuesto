'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';
import { changePassword, deleteAccount } from '@/lib/users';
import DeleteAccountModal from './DeleteAccountModal';

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function SecuritySettings() {
    const { handleError } = useErrorHandler();
    const { data: session } = useSession();

    // Detectar si el usuario inició sesión con Google
    const isGoogleUser = !!session?.user?.googleId;
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePassword = () => {
        if (!passwordForm.currentPassword) {
            alert('❌ La contraseña actual es requerida');
            return false;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('❌ La nueva contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (!passwordForm.confirmPassword) {
            alert('❌ La confirmación de contraseña es requerida');
            return false;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('❌ Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        try {
            setLoading(true);

            // Llamar al backend para cambiar la contraseña
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword
            });

            // Reset form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false);
            setShowPasswords({
                current: false,
                new: false,
                confirm: false
            });

            alert('✅ Contraseña actualizada correctamente');

        } catch (error) {
            handleError(error, 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowPasswordForm(false);
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });
    };

    const handleDeleteAccount = async (data: { password?: string; confirmation: string }) => {
        try {
            setDeletingAccount(true);

            await deleteAccount(data);

            // Redirigir a la página principal y cerrar sesión
            alert('✅ Cuenta eliminada correctamente. Serás redirigido a la página principal.');

            // Limpiar cookies y redirigir
            document.cookie = 'token=; Max-Age=0; path=/';
            window.location.href = '/';

        } catch (error) {
            handleError(error, 'Error al eliminar la cuenta');
            setDeletingAccount(false);
        }
    };

    const isFormValid = passwordForm.currentPassword &&
                       passwordForm.newPassword &&
                       passwordForm.confirmPassword;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Configuración de Seguridad</h2>
                <p className="text-sm text-gray-600">Administra la seguridad de tu cuenta</p>
            </div>

            <div className="space-y-4">
                {/* Cambiar contraseña - Solo para usuarios con contraseña local */}
                {!isGoogleUser && (
                <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Contraseña</h3>
                            <p className="text-sm text-gray-600">
                                {showPasswordForm ? 'Ingresa tu contraseña actual y la nueva' : 'Gestiona la contraseña de tu cuenta'}
                            </p>
                        </div>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                            >
                                Cambiar
                            </button>
                        )}
                    </div>

                    {showPasswordForm && (
                        <div className="mt-4 space-y-4">
                            {/* Contraseña actual */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Contraseña actual *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                        placeholder="Tu contraseña actual"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Nueva contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Nueva contraseña *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {passwordForm.newPassword && passwordForm.newPassword.length < 6 && (
                                    <p className="text-xs text-red-600 mt-1">
                                        La contraseña debe tener al menos 6 caracteres
                                    </p>
                                )}
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Confirmar nueva contraseña *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                        placeholder="Repite la nueva contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">
                                        Las contraseñas no coinciden
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex items-center space-x-3 pt-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading || !isFormValid}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}

                {/* Información para usuarios de Google */}
                {isGoogleUser && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-900">Cuenta vinculada con Google</h3>
                            <p className="text-sm text-blue-700">Tu contraseña es gestionada por Google. No necesitas cambiarla aquí.</p>
                        </div>
                    </div>
                </div>
                )}


                {/* Eliminación de cuenta */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-red-900">Zona de peligro</h3>
                            <p className="text-sm text-red-600">Eliminar permanentemente tu cuenta y todos los datos</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={deletingAccount}
                            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
                        </button>
                    </div>
                </div>
            </div>

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                loading={deletingAccount}
            />
        </div>
    );
}