'use client';

import { login } from '@/lib/users';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    // Mostrar la sesión en consola cuando cambie
    useEffect(() => {

        // Redirigir si ya hay sesión de Google
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const data = await login(email, password);
            console.log(data);
            Cookies.set('token', data.access_token, { expires: 7 });
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: '/' });
        } catch (error) {
            setError('Error al iniciar sesión con Google');
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                {/* Columna del formulario */}
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col">
                    <div className="mt-12 flex flex-col items-center flex-1">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Iniciar sesión
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col items-center">
                                <button
                                    className="cursor-pointer w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow disabled:opacity-50"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                >
                                    <img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        alt="Google"
                                        className="w-5 h-5"
                                    />
                                    <span className="ml-4">Iniciar sesión con Google</span>
                                </button>
                            </div>

                            <div className="my-12 border-b text-center">
                                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    O inicia sesión con tu correo
                                </div>
                            </div>

                            <form className="mx-auto max-w-xs" onSubmit={handleSubmit}>
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                {error && (
                                    <div className="text-red-500 text-sm mt-2">{error}</div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <path d="M20 8v6M23 11h-6" />
                                            </svg>
                                            <span className="ml-3">
                                                Iniciar sesión
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Columna derecha con imagen de fondo */}
                <div className="flex-1 hidden lg:flex">
                    <div
                        className="m-0 w-full h-full bg-cover bg-center rounded-r-lg"
                        style={{ backgroundImage: "url('/planta_dinero.jpg')" }}
                    />
                </div>
            </div>
        </div>
    );
}