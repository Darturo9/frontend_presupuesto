'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirigir al dashboard si está autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si está autenticado, mostrar mensaje de redirección
  if (isAuthenticated) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-lg">Redirigiendo al dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg z-10">
          <p className="text-green-700 font-medium">
            ¡Hola {user.firstName}! Redirigiendo al dashboard...
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <img
              src="/planta_dinero.jpg"
              alt="Presupuesto Personal"
              className="h-32 w-32 rounded-full object-cover shadow-2xl border-4 border-white"
            />
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Presupuesto Personal
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            La forma más inteligente de gestionar tu dinero. Controla tus gastos,
            planifica tus metas y construye un futuro financiero sólido.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Comenzar Gratis
              </a>
              <a
                href="/login"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Iniciar Sesión
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Why Budget Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué necesitas un presupuesto?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un presupuesto personal no es solo un registro de gastos, es tu herramienta
              para alcanzar la libertad financiera y vivir sin estrés económico.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <img src="/monedas.jpg" alt="Control" className="w-12 h-12 rounded-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Control Total</h3>
              <p className="text-gray-600">
                Sabe exactamente dónde va cada quetzal. No más sorpresas al final del mes.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Alcanza tus Metas</h3>
              <p className="text-gray-600">
                Ahorra para esa casa, carro o vacaciones soñadas. Convierte tus sueños en realidad.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Emergencias Cubiertas</h3>
              <p className="text-gray-600">
                Crea tu fondo de emergencia. Duerme tranquilo sabiendo que estás preparado.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Elimina Deudas</h3>
              <p className="text-gray-600">
                Plan estratégico para salir de deudas más rápido y pagar menos intereses.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <img src="/dinero.jpg" alt="Inversión" className="w-12 h-12 rounded-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Invierte Inteligentemente</h3>
              <p className="text-gray-600">
                Identifica oportunidades de inversión y haz que tu dinero trabaje para ti.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">😌</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Paz Mental</h3>
              <p className="text-gray-600">
                Reduce el estrés financiero. Vive con confianza y tranquilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Todo lo que necesitas en una app
            </h2>
            <p className="text-xl text-gray-600">
              Herramientas poderosas y fáciles de usar para gestionar tu dinero como un experto
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">📊 Seguimiento Inteligente</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Categorización automática de gastos e ingresos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Gráficos y reportes visuales en tiempo real</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Alertas inteligentes cuando te acercas a límites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Historial completo de todas tus transacciones</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 p-8 rounded-2xl inline-block">
                <img
                  src="/planta_dinero.jpg"
                  alt="Dashboard Preview"
                  className="w-48 h-48 rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="text-center md:order-1">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-8 rounded-2xl inline-block">
                <img
                  src="/monedas.jpg"
                  alt="Savings Goals"
                  className="w-48 h-48 rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
            <div className="md:order-2">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">🎯 Metas y Planificación</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Define metas de ahorro con plazos realistas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Presupuestos mensuales por categoría</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Proyecciones financieras a futuro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="text-gray-800 font-medium">Calculadora de tiempo para alcanzar objetivos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para tomar control de tu dinero?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Únete a miles de guatemaltecos que ya transformaron su vida financiera.
            Es gratis, es fácil, y puedes empezar ahora mismo.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg text-lg"
              >
                Crear Cuenta Gratis
              </a>
              <a
                href="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition text-lg"
              >
                Ya tengo cuenta
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/planta_dinero.jpg"
              alt="Presupuesto Personal"
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <p className="mb-4">© 2024 Presupuesto Personal. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400">
            Hecho con ❤️ para la comunidad guatemalteca
          </p>
        </div>
      </footer>
    </div>
  );
}