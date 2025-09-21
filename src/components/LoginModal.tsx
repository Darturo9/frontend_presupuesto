'use client';

import React from 'react';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px] text-center">
                <p className="mb-6 text-lg text-gray-800">Hola soy un modal</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}