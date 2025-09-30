'use client';

import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login, loginGoogle } from "@/lib/users";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const alreadySent = useRef(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Google login integration
    useEffect(() => {
        if (session?.user?.googleId && session.user.email && !alreadySent.current) {
            alreadySent.current = true;
            loginGoogle({
                email: session.user.email,
                googleId: session.user.googleId,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                avatar: session.user.image ?? undefined,
            })
                .then(res => {
                    Cookies.set('token', res.access_token, { path: '/', expires: 7 });
                    router.push('/');
                })
                .catch(err => {
                    setError(err.message || 'Error al iniciar sesión con Google');
                });
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(email, password);
            Cookies.set('token', res.access_token, { path: '/', expires: 7 });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Panel izquierdo - Formulario */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido de vuelta</h2>
                        <p className="text-gray-600">Inicia sesión para gestionar tus finanzas</p>
                    </div>
                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/login' })}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition mb-4"
                >
                    <img src="/logoGoogle.png" alt="Google" className="w-5 h-5" />
                    Iniciar sesión con Google
                </button>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-400">o</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium text-gray-900">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-900">Contraseña</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Iniciar sesión
                    </button>
                </form>

                {/* Link a registro */}
                <p className="mt-6 text-center text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                        Regístrate aquí
                    </a>
                </p>
                </div>
            </div>

            {/* Panel derecho - Imagen */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-400 to-blue-500 items-center justify-center p-8">
                <div className="text-center text-white">
                    <img
                        src="/planta_dinero.jpg"
                        alt="Presupuesto Personal"
                        className="h-64 w-64 mx-auto rounded-full object-cover shadow-2xl mb-8"
                    />
                    <h3 className="text-2xl font-bold mb-4">Presupuesto Personal</h3>
                    <p className="text-lg opacity-90 mb-6">
                        Toma control de tus finanzas con nuestra plataforma intuitiva
                    </p>
                    <div className="space-y-3 text-sm opacity-80">
                        <p>✅ Gestiona ingresos y gastos</p>
                        <p>✅ Categoriza tus transacciones</p>
                        <p>✅ Visualiza tu progreso financiero</p>
                    </div>
                </div>
            </div>
        </div>
    );
}