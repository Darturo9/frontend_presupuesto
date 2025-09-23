'use client';

import { useSession, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { register, loginGoogle } from "@/lib/users";

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
                    // Cookies.set('token', res.access_token);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h2>
                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/register' })}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition mb-4"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <g>
                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.23l6.92-6.92C36.68 2.36 30.7 0 24 0 14.82 0 6.73 5.08 2.69 12.44l8.06 6.26C12.36 13.08 17.74 9.5 24 9.5z" />
                            <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.02h12.42c-.54 2.92-2.18 5.39-4.66 7.06l7.18 5.59C43.93 37.14 46.1 31.34 46.1 24.5z" />
                            <path fill="#FBBC05" d="M10.75 28.7c-1.01-2.99-1.01-6.21 0-9.2l-8.06-6.26C.98 17.7 0 20.75 0 24c0 3.25.98 6.3 2.69 8.76l8.06-6.26z" />
                            <path fill="#EA4335" d="M24 48c6.7 0 12.68-2.21 16.9-6.02l-7.18-5.59c-2.01 1.35-4.59 2.11-7.72 2.11-6.26 0-11.64-3.58-13.25-8.7l-8.06 6.26C6.73 42.92 14.82 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </g>
                    </svg>
                    Registrarse con Google
                </button>
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
            </div>
        </div>
    );
}