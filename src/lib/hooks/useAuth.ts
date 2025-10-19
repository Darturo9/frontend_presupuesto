import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const useAuth = () => {
    const { data: session, status } = useSession();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [forceLogout, setForceLogout] = useState(false);

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true);
            return;
        }

        // Si forzamos logout, mantener desautenticado y NO reestablecer el token
        if (forceLogout) {
            setIsAuthenticated(false);
            setIsLoading(false);
            // Asegurarnos de que el token esté borrado
            const tokenExists = Cookies.get('token');
            if (tokenExists) {
                Cookies.remove('token');
                Cookies.remove('token', { path: '/' });
            }
            return;
        }

        // Si la sesión está presente pero no tiene backendToken, significa que expiró
        // Esto previene el loop infinito
        if (status === 'authenticated' && session && !session.backendToken) {
            console.warn('⚠️ Sesión sin token del backend - posiblemente expirada');
            setIsAuthenticated(false);
            setIsLoading(false);
            // Limpiar cookies para forzar re-login
            Cookies.remove('token');
            Cookies.remove('token', { path: '/' });
            // Hacer signOut silencioso
            nextAuthSignOut({ redirect: false }).catch(err =>
                console.error('Error al cerrar sesión expirada:', err)
            );
            return;
        }

        const manualToken = Cookies.get('token');

        // Si hay sesión de Google, guardamos el token automáticamente
        if (session?.backendToken) {
            Cookies.set('token', session.backendToken, { path: '/', expires: 60 }); // 60 días (2 meses, igual que el JWT del backend)
            setIsAuthenticated(true);
            // Reset forceLogout cuando hay una nueva sesión válida
            setForceLogout(false);
        }
        // Si no hay sesión de Google pero hay token manual, también está autenticado
        else if (manualToken) {
            setIsAuthenticated(true);
            // Reset forceLogout cuando hay un token manual válido
            setForceLogout(false);
        }
        // Si no hay ninguno, no está autenticado
        else {
            setIsAuthenticated(false);
        }

        setIsLoading(false);
    }, [session, status, forceLogout]);

    // Función simplificada de logout (ahora la lógica compleja está en LogoutButton)
    const logout = async () => {
        setForceLogout(true);
        setIsAuthenticated(false);
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' });

        if (session) {
            await nextAuthSignOut({ redirect: false });
        }
    };

    const getToken = () => {
        // Si forzamos logout, no devolver ningún token
        if (forceLogout) return null;
        return Cookies.get('token') || session?.backendToken || null;
    };

    const getUserInfo = () => {
        // Si forzamos logout, no devolver info de usuario
        if (forceLogout) return null;

        if (session?.user) {
            return {
                email: session.user.email,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                avatar: session.user.avatar,
                source: 'google'
            };
        }

        // Para usuarios con login manual, podrías obtener info de otra fuente
        // o hacer una llamada API para obtener los datos del usuario
        return null;
    };

    return {
        isAuthenticated,
        isLoading,
        user: getUserInfo(),
        token: getToken(),
        logout,
        session // Por si necesitas acceso directo a la sesión
    };
};