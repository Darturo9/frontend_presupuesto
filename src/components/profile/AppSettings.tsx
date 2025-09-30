'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';
import { getUserSettings, updateUserSettings } from '@/lib/users';

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
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState<AppSettingsData | null>(null);

    // Cargar configuración del usuario desde el backend
    useEffect(() => {
        const loadUserSettings = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setLoadingSettings(false);
                return;
            }

            try {
                setLoadingSettings(true);
                const userSettings = await getUserSettings();
                const settingsData = {
                    currency: userSettings.currency || 'GTQ',
                    dateFormat: userSettings.dateFormat || 'DD/MM/YYYY',
                    language: userSettings.language || 'es',
                    monthlyBudgetLimit: userSettings.monthlyBudgetLimit || undefined,
                    notifications: {
                        budgetAlerts: userSettings.budgetAlerts ?? true,
                        transactionReminders: userSettings.transactionReminders ?? false,
                        weeklyReports: userSettings.weeklyReports ?? true,
                    }
                };
                setSettings(settingsData);
                setOriginalSettings(settingsData);
            } catch (error) {
                handleError(error, 'Error al cargar la configuración del usuario');
            } finally {
                setLoadingSettings(false);
            }
        };

        loadUserSettings();
    }, [handleError]);

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

            // Guardar configuración en el backend
            await updateUserSettings({
                currency: settings.currency,
                dateFormat: settings.dateFormat,
                language: settings.language,
                monthlyBudgetLimit: settings.monthlyBudgetLimit,
                budgetAlerts: settings.notifications.budgetAlerts,
                transactionReminders: settings.notifications.transactionReminders,
                weeklyReports: settings.notifications.weeklyReports,
            });

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

    if (loadingSettings) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                </div>

                <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i}>
                            <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Configuración de la Aplicación</h2>
                    <p className="text-sm text-gray-600">Personaliza la experiencia de uso</p>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium bg-white"
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

                {/* Soporte */}
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Soporte</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-blue-900">¿Necesitas ayuda?</h3>
                                <p className="mt-1 text-sm text-blue-800">
                                    Si tienes problemas con tu cuenta o necesitas asistencia, contáctanos.
                                </p>
                                <div className="mt-3">
                                    <a
                                        href="https://wa.me/50255580173?text=Hola%2C%20necesito%20ayuda%20con%20mi%20aplicaci%C3%B3n%20de%20presupuesto"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-2.462-.96-4.779-2.705-6.526-1.746-1.746-4.065-2.711-6.526-2.713-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.092-.634zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                        </svg>
                                        Contactar soporte →
                                    </a>
                                </div>
                            </div>
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