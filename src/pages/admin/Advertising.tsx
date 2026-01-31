import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon, Link as LinkIcon, Plus, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import useNotify from '../../hooks/useNotify';
import { useConfirm } from '../../hooks/useConfirm';

interface Advertising {
    id: number;
    image: string;
    link: string;
    buttonText: string;
    status: boolean;
    createdAt?: string;
}

const Advertising = () => {

    const { notify } = useNotify();
    const confirm = useConfirm();
    const [advertisements, setAdvertisements] = useState<Advertising[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentAdv, setCurrentAdv] = useState<Advertising | null>(null);

    const fetchAdvertisements = async () => {
        try {
            const response = await request.get(`${apiUrl}/advertising`);
            if (response.data.success) {
                const advertisements = response.data.body.advertising;
                setAdvertisements(advertisements);
            }


        } catch (error) {
            console.error('Error fetching advertising:', error);
            notify.error('Error al cargar la publicidad');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const handleOpenModal = (adv?: Advertising) => {
        if (adv) {
            setCurrentAdv({ ...adv });
        } else {
            setCurrentAdv({
                id: -1,
                image: '',
                link: '',
                buttonText: 'Ver más',
                status: advertisements.length === 0 // Active by default if it's the first one
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentAdv(null);
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        if (!currentAdv) return;
        setCurrentAdv(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentAdv) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setCurrentAdv(prev => prev ? { ...prev, image: base64String } : null);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!currentAdv) return;
        if (!currentAdv.image) {
            notify.error('Debes subir una imagen');
            return;
        }

        setSaving(currentAdv.id);
        try {
            const isNew = currentAdv.id < 0;
            const url = isNew ? `${apiUrl}/advertising` : `${apiUrl}/advertising/${currentAdv.id}`;
            const method = isNew ? 'post' : 'put';
            
            const response = await request[method](url, currentAdv);
            if (response.data.success) {
                notify.success(`Publicidad ${isNew ? 'creada' : 'actualizada'} correctamente`);
                fetchAdvertisements();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving advertising:', error);
            notify.error('Error al guardar la publicidad');
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm('¿Estás seguro de que deseas eliminar esta publicidad?');
        if (!isConfirmed) return;
        
        setDeleting(id);
        try {
            const response = await request.delete(`${apiUrl}/advertising/${id}`);
            if (response.data.success) {
                notify.success('Publicidad eliminada correctamente');
                setAdvertisements(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error('Error deleting advertising:', error);
            notify.error('Error al eliminar la publicidad');
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleStatus = async (adv: Advertising) => {
        if (adv.status) return; // Already active, do nothing (only one active allowed)

        setSaving(adv.id);
        try {
            const response = await request.put(`${apiUrl}/advertising/${adv.id}`, {
                ...adv,
                status: true
            });
            if (response.data.success) {
                notify.success('Publicidad activada correctamente');
                fetchAdvertisements();
            }
        } catch (error) {
            console.error('Error activating advertising:', error);
            notify.error('Error al activar la publicidad');
        } finally {
            setSaving(null);
        }
    };

    const getImageUrl = (image: string) => {
        if (!image) return '';
        if (image.startsWith('data:') || image.startsWith('http')) return image;
        return `${apiUrl.replace('/api/v1', '')}/images/advertising/${image}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Publicidad</h1>
                    <p className="text-sm text-gray-500 mt-1 italic">Administra el banner publicitario emergente.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg shadow-red-100 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Publicidad</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {advertisements.map((adv) => (
                    <div key={adv.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all">
                        <div className="relative aspect-video bg-gray-100">
                            {adv.image ? (
                                <img
                                    src={getImageUrl(adv.image)}
                                    alt="Publicidad"
                                    className={`w-full h-full object-cover ${!adv.status ? 'opacity-40 grayscale' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            
                            <div className="absolute top-3 left-3">
                                {adv.status ? (
                                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Activa
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                                        <AlertCircle size={12} /> Inactiva
                                    </div>
                                )}
                            </div>

                            <div className="absolute top-3 right-3 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(adv)}
                                    className="p-2 bg-white/95 backdrop-blur-sm text-gray-700 hover:text-blue-600 rounded-xl shadow-sm transition-colors"
                                    title="Editar"
                                >
                                    <X className="w-4 h-4 rotate-45" />
                                </button>
                                <button
                                    onClick={() => handleDelete(adv.id)}
                                    disabled={deleting === adv.id}
                                    className="p-2 bg-white/95 backdrop-blur-sm text-gray-700 hover:text-red-600 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                                    title="Eliminar"
                                >
                                    {deleting === adv.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <LinkIcon className="w-3 h-3 shrink-0" />
                                <span className="truncate">{adv.link || 'Sin enlace'}</span>
                            </div>
                            {adv.link && (
                                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg w-fit uppercase tracking-wider">
                                    Botón: {adv.buttonText}
                                </div>
                            )}
                            
                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                {!adv.status ? (
                                    <button
                                        onClick={() => handleToggleStatus(adv)}
                                        disabled={saving === adv.id}
                                        className="text-green-600 hover:text-green-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                                    >
                                        {saving === adv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                        Activar
                                    </button>
                                ) : (
                                    <span className="text-gray-300 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        En uso
                                    </span>
                                )}
                                <button
                                    onClick={() => handleOpenModal(adv)}
                                    className="text-red-600 hover:text-red-700 font-bold text-xs uppercase tracking-widest transition-colors ml-auto"
                                >
                                    Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {advertisements.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No hay publicidades configuradas.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-4 text-red-600 font-bold hover:underline"
                        >
                            Crear una ahora
                        </button>
                    </div>
                )}
            </div>

            {/* Modal para Agregar/Editar */}
            {showModal && currentAdv && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
                                {currentAdv.id < 0 ? 'Nueva Publicidad' : 'Editar Publicidad'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Imagen Publicitaria</label>
                                <div className="relative group rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 aspect-video flex flex-col items-center justify-center transition-all hover:border-red-400">
                                    {currentAdv.image ? (
                                        <>
                                            <img
                                                src={getImageUrl(currentAdv.image)}
                                                alt="Vista previa"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <label className="cursor-pointer bg-white text-gray-900 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl hover:scale-105 transition-transform">
                                                    <Upload className="w-4 h-4" /> Cambiar Imagen
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center gap-3 text-gray-400 hover:text-red-500 transition-colors p-10">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <span className="font-bold text-sm uppercase tracking-wider">Subir Banner</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 italic text-center font-medium">Formato recomendado: 1200x800px for mejor visualización.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Enlace de Acción</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <LinkIcon className="h-4 w-4 text-gray-300" />
                                            </div>
                                            <input
                                                type="text"
                                                value={currentAdv.link}
                                                onChange={(e) => handleInputChange('link', e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-medium"
                                                placeholder="https://o-ruta-interna"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Texto del Botón</label>
                                        <input
                                            type="text"
                                            value={currentAdv.buttonText}
                                            onChange={(e) => handleInputChange('buttonText', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-medium"
                                            placeholder="Ej: Ver más"
                                            disabled={!currentAdv.link}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-4 cursor-pointer group p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={currentAdv.status}
                                            onChange={(e) => handleInputChange('status', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${currentAdv.status ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${currentAdv.status ? 'translate-x-6' : 'translate-x-0 shadow-sm'}`}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Publicidad Activa</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Desactivará automáticamente la publicidad actual.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
                                disabled={saving !== null}
                                className="px-6 py-3 text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving !== null}
                                className="px-8 py-3 bg-red-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {saving !== null ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {currentAdv.id < 0 ? 'Crear Ahora' : 'Guardar Cambios'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Advertising;
