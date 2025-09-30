'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { password?: string; confirmation: string }) => Promise<void>;
    loading: boolean;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }: DeleteAccountModalProps) {
    const { data: session } = useSession();
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);

    const isGoogleUser = !!session?.user?.googleId;
    const isConfirmationValid = confirmation === 'ELIMINAR';
    const isFormValid = isGoogleUser ? isConfirmationValid : (password && isConfirmationValid);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        await onConfirm({
            password: isGoogleUser ? undefined : password,
            confirmation
        });
    };

    const handleClose = () => {
        setPassword('');
        setConfirmation('');
        setStep(1);
        setShowPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {step === 1 && (
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Eliminar cuenta</h3>
                                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-red-900 mb-2">⚠️ ¿Estás seguro?</h4>
                                <p className="text-sm text-red-800 mb-2">
                                    Al eliminar tu cuenta se perderán permanentemente:
                                </p>
                                <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
                                    <li>Todas tus transacciones</li>
                                    <li>Categorías personalizadas</li>
                                    <li>Presupuestos y configuraciones</li>
                                    <li>Historial financiero</li>
                                    <li>Datos de perfil</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">💡 Alternativas</h4>
                                <p className="text-sm text-blue-800">
                                    Si solo quieres tomarte un descanso, puedes desactivar las notificaciones
                                    en la configuración de la aplicación en lugar de eliminar tu cuenta.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => setStep(1)}
                                className="mr-3 p-1 hover:bg-gray-100 rounded"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
                                <p className="text-sm text-gray-600">Completa los siguientes pasos</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {!isGoogleUser && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                                        Tu contraseña *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                                            placeholder="Ingresa tu contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
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
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                    Escribe "ELIMINAR" para confirmar *
                                </label>
                                <input
                                    type="text"
                                    value={confirmation}
                                    onChange={(e) => setConfirmation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                                    placeholder="ELIMINAR"
                                />
                                {confirmation && !isConfirmationValid && (
                                    <p className="text-sm text-red-600 mt-1">
                                        Debes escribir exactamente "ELIMINAR"
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || loading}
                                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Eliminando...' : 'Eliminar cuenta'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}