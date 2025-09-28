import { useCallback } from 'react';

interface RateLimitError extends Error {
  isRateLimit: boolean;
  details: string;
  retryAfter: number;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: any, fallbackMessage = 'Ha ocurrido un error') => {
    // Error de rate limiting
    if (error.isRateLimit) {
      const rateLimitError = error as RateLimitError;

      // Mostrar mensaje específico de rate limiting
      alert(`⚠️ ${rateLimitError.message}\n\n${rateLimitError.details}`);

      return {
        type: 'rate-limit',
        message: rateLimitError.message,
        details: rateLimitError.details,
        retryAfter: rateLimitError.retryAfter
      };
    }

    // Error de validación del backend
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Datos inválidos';
      alert(`❌ ${message}`);

      return {
        type: 'validation',
        message
      };
    }

    // Error de autorización
    if (error.response?.status === 401) {
      alert('🔒 Sesión expirada. Por favor, inicia sesión nuevamente.');

      return {
        type: 'auth',
        message: 'Sesión expirada'
      };
    }

    // Error de permisos
    if (error.response?.status === 403) {
      alert('🚫 No tienes permisos para realizar esta acción.');

      return {
        type: 'permission',
        message: 'Sin permisos'
      };
    }

    // Error de servidor
    if (error.response?.status >= 500) {
      alert('🔧 Error del servidor. Intenta de nuevo más tarde.');

      return {
        type: 'server',
        message: 'Error del servidor'
      };
    }

    // Error genérico
    const message = error.response?.data?.message || error.message || fallbackMessage;
    alert(`❌ ${message}`);

    return {
      type: 'generic',
      message
    };
  }, []);

  return { handleError };
};