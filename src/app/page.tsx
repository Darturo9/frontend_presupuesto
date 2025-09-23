'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function HomePage() {
  const [isLogged, setIsLogged] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const token = Cookies.get('token');
    console.log("SESSION EN HOME:", session);
    // Considera logeado si hay token O si hay sesión de NextAuth
    setIsLogged(!!token || !!session);
  }, [session]);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLogged(false);
    if (session) signOut(); // Cierra sesión de Google si existe
  };

  return (
    <div className="p-8">
      {isLogged ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">¡Bienvenido!</h1>
          <p>Estás logeado y puedes ver tu información privada.</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Bienvenido a Presupuesto App</h1>
          <p>Por favor, inicia sesión para acceder a tus presupuestos.</p>
        </div>
      )}
    </div>
  );
}