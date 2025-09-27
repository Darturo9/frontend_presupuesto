'use client';

import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { register, loginGoogle } from "@/lib/users";
import Cookies from 'js-cookie';

export default function RegisterPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const alreadySent = useRef(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Google register integration
    useEffect(() => {
        if (session?.user?.googleId && session.user.email && !alreadySent.current) {
            alreadySent.current = true;
            loginGoogle({
                email: session.user.email,
                googleId: session.user.googleId,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                avatar: session.user.image ?? undefined, // <-- aquí
            })
                .then(res => {
                    // Guarda el token si lo necesitas, ejemplo:
                    Cookies.set('token', res.access_token);
                    router.push('/');
                })
                .catch(err => {
                    setError(err.message || 'Error al registrar usuario con Google');
                });
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setSuccess('');
            return;
        }
        setError('');
        setSuccess('');
        try {
            await register({ email, password, firstName, lastName });
            setSuccess('¡Usuario registrado exitosamente!');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Panel izquierdo - Formulario */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Crea tu cuenta</h2>
                        <p className="text-gray-600">Únete y toma control de tu dinero</p>
                    </div>
                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/register' })}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition mb-4"
                >
                    <img src="/logoGoogle.png" alt="Google" className="w-5 h-5" />
                    Registrarse con Google
                </button>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-400">o</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-600 text-sm">{success}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Crear cuenta
                    </button>
                </form>

                {/* Link a login */}
                <p className="mt-6 text-center text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Inicia sesión aquí
                    </a>
                </p>
                </div>
            </div>

            {/* Panel derecho - Imagen */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center p-8">
                <div className="text-center text-white">
                    <img
                        src="/planta_dinero.jpg"
                        alt="Presupuesto Personal"
                        className="h-64 w-64 mx-auto rounded-full object-cover shadow-2xl mb-8"
                    />
                    <h3 className="text-2xl font-bold mb-4">¡Comienza tu viaje financiero!</h3>
                    <p className="text-lg opacity-90 mb-6">
                        Más de 10,000 usuarios ya confían en nosotros
                    </p>
                    <div className="space-y-3 text-sm opacity-80">
                        <p>🚀 Configuración rápida y fácil</p>
                        <p>🔒 Tus datos están completamente seguros</p>
                        <p>📊 Reportes detallados de tus finanzas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}