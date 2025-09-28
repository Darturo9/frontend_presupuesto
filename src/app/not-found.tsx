import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustración 404 */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            404
          </div>
          <div className="text-6xl mt-4">🤔</div>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Oops! Página no encontrada
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          La página que buscas no existe o ha sido movida.
          No te preocupes, te ayudamos a encontrar lo que necesitas.
        </p>

        {/* Botones de acción */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al Inicio
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ir al Dashboard
          </Link>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">¿Necesitas ayuda?</p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/dashboard/categories"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Categorías
            </Link>
            <Link
              href="/dashboard/transactions"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Transacciones
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}