import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardNotFound() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center">
          {/* Icono 404 */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
            <div className="text-4xl">📊❓</div>
          </div>

          {/* Mensaje */}
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Página del Dashboard no encontrada
          </h1>

          <p className="text-gray-600 mb-6">
            Esta página del dashboard no existe o ha sido movida.
          </p>

          {/* Botones de navegación */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al Dashboard
            </Link>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/dashboard/transactions"
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Transacciones
              </Link>
              <Link
                href="/dashboard/categories"
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Categorías
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}