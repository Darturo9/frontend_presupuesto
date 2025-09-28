'use client';

import { useState, useEffect } from 'react';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';

interface AppSettingsData {
    currency: string;
    dateFormat: string;
    language: string;
    monthlyBudgetLimit?: number;
    notifications: {
        budgetAlerts: boolean;
        transactionReminders: boolean;
        weeklyReports: boolean;
    };
}

const CURRENCIES = [
    { code: 'GTQ', name: 'Quetzal Guatemalteco (Q)', symbol: 'Q' },
    { code: 'USD', name: 'Dólar Estadounidense ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'MXN', name: 'Peso Mexicano ($)', symbol: '$' },
];

const DATE_FORMATS = [
    { value: 'DD/MM/YYYY', label: '31/12/2024 (DD/MM/YYYY)' },
    { value: 'MM/DD/YYYY', label: '12/31/2024 (MM/DD/YYYY)' },
    { value: 'YYYY-MM-DD', label: '2024-12-31 (YYYY-MM-DD)' },
];

const LANGUAGES = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English (próximamente)' },
];

export default function AppSettings() {
    const { handleError } = useErrorHandler();
    const [settings, setSettings] = useState<AppSettingsData>({
        currency: 'GTQ',
        dateFormat: 'DD/MM/YYYY',
        language: 'es',
        monthlyBudgetLimit: undefined,
        notifications: {
            budgetAlerts: true,
            transactionReminders: false,
            weeklyReports: true,
        }
    });
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState<AppSettingsData | null>(null);

    // Simular carga de configuración (después conectaremos con el backend)
    useEffect(() => {
        // TODO: Implementar llamada al backend para obtener configuración del usuario
        const mockSettings = {
            currency: 'GTQ',
            dateFormat: 'DD/MM/YYYY',
            language: 'es',
            monthlyBudgetLimit: 5000,
            notifications: {
                budgetAlerts: true,
                transactionReminders: false,
                weeklyReports: true,
            }
        };
        setSettings(mockSettings);
        setOriginalSettings(mockSettings);
    }, []);

    useEffect(() => {
        if (originalSettings) {
            setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
        }
    }, [settings, originalSettings]);

    const handleSettingChange = (key: keyof AppSettingsData, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleNotificationChange = (key: keyof AppSettingsData['notifications'], value: boolean) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // TODO: Implementar llamada al backend para guardar configuración
            console.log('Guardando configuración:', settings);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setOriginalSettings(settings);
            setHasChanges(false);
            alert('✅ Configuración guardada correctamente');

        } catch (error) {
            handleError(error, 'Error al guardar la configuración');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (originalSettings) {
            setSettings(originalSettings);
            setHasChanges(false);
        }
    };

    const formatCurrency = (amount: number) => {
        const currency = CURRENCIES.find(c => c.code === settings.currency);
        return `${currency?.symbol || ''}${amount.toLocaleString('es-GT')}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configuración de la Aplicación</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Personaliza la experiencia de uso</p>
                </div>
                {hasChanges && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Restablecer
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Configuración de moneda */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Moneda</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {CURRENCIES.map((currency) => (
                            <div key={currency.code} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`currency-${currency.code}`}
                                    name="currency"
                                    value={currency.code}
                                    checked={settings.currency === currency.code}
                                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor={`currency-${currency.code}`} className="ml-3 block text-sm text-gray-900 font-medium">
                                    {currency.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formato de fecha */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Formato de fecha</h3>
                    <select
                        value={settings.dateFormat}
                        onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-gray-700"
                    >
                        {DATE_FORMATS.map((format) => (
                            <option key={format.value} value={format.value}>
                                {format.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Idioma */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Idioma</h3>
                    <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 font-medium bg-white dark:bg-gray-700"
                    >
                        {LANGUAGES.map((language) => (
                            <option key={language.code} value={language.code} disabled={language.code === 'en'}>
                                {language.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Límite de presupuesto mensual */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Límite de presupuesto mensual (opcional)</h3>
                    <div className="relative">
                        <input
                            type="number"
                            value={settings.monthlyBudgetLimit || ''}
                            onChange={(e) => handleSettingChange('monthlyBudgetLimit', e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                            placeholder="5000"
                            min="0"
                            step="100"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">
                                {CURRENCIES.find(c => c.code === settings.currency)?.symbol}
                            </span>
                        </div>
                    </div>
                    {settings.monthlyBudgetLimit && (
                        <p className="text-xs text-gray-700 mt-1 font-medium">
                            Te alertaremos cuando te acerques al límite de {formatCurrency(settings.monthlyBudgetLimit)}
                        </p>
                    )}
                </div>

                {/* Notificaciones */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Notificaciones</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Alertas de presupuesto</p>
                                <p className="text-xs text-gray-600">Cuando te acerques a tu límite mensual</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.budgetAlerts}
                                    onChange={(e) => handleNotificationChange('budgetAlerts', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Recordatorios de transacciones</p>
                                <p className="text-xs text-gray-600">Recordarte registrar gastos diarios</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.transactionReminders}
                                    onChange={(e) => handleNotificationChange('transactionReminders', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Reportes semanales</p>
                                <p className="text-xs text-gray-600">Resumen de tus finanzas cada semana</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.weeklyReports}
                                    onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {hasChanges && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Tienes cambios sin guardar en tu configuración
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}