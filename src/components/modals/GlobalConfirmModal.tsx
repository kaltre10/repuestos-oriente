// components/GlobalConfirmModal.tsx
import { FC } from 'react';
import { AlertCircle } from 'lucide-react';
import useConfirmStore from '../../states/useConfirmStore';

export const GlobalConfirmModal: FC = () => {
    const { isOpen, message, confirm } = useConfirmStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white w-[90vw] max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Confirmar acción</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                        {message || "¿Estás seguro de continuar?"}
                    </p>
                </div>

                <div className="flex border-t border-gray-100 p-4 gap-3">
                    <button
                        type="button"
                        onClick={() => confirm(false)}
                        className="flex-1 px-6 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => confirm(true)}
                        className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};