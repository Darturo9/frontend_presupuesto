import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-50">
      <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Bienvenido a Presupuesto App
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Organiza tus finanzas personales, controla tus gastos y alcanza tus
          metas de ahorro.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💸</span>
            <span className="text-gray-800">
              Registra tus ingresos y egresos fácilmente
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span className="text-gray-800">
              Visualiza tu presupuesto y categorías de gasto
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <span className="text-gray-800">
              Establece metas de ahorro y síguelas mes a mes
            </span>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/register"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Crear cuenta
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </main>
  );
}
