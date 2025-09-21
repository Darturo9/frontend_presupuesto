'use client';

import { useState } from 'react';
import LoginModal from '@/components/LoginModal';

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLogin = () => {
        setShowLoginModal(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <header className="px-6 py-4 border-b flex justify-between items-center bg-white shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">Presupuesto App</h1>
            <nav>
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Cerrar sesión
                    </button>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Iniciar sesión
                    </button>
                )}
            </nav>
            <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </header>
    );
}