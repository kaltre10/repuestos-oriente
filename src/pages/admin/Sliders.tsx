import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon, Type, Link as LinkIcon, AlignLeft, Plus, Trash2, X } from 'lucide-react';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import useNotify from '../../hooks/useNotify';
import { useConfirm } from '../../hooks/useConfirm';

interface Slider {
    id: number;
    title: string;
    description1: string;
    description2: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    status: boolean;
}

const Sliders = () => {
    const { notify } = useNotify();
    const confirm = useConfirm();
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentSlider, setCurrentSlider] = useState<Slider | null>(null);

    const fetchSliders = async () => {
        try { 
            const response = await request.get(`${apiUrl}/sliders`);
            console.log('Response sliders:', response);
            if (response.data.success) {
                setSliders(response.data.body.sliders);
            }
        } catch (error) {
            console.error('Error fetching sliders:', error);
            notify.error('Error al cargar los sliders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleOpenModal = (slider?: Slider) => {
        if (slider) {
            setCurrentSlider({ ...slider });
        } else {
            setCurrentSlider({
                id: -1,
                title: '',
                description1: '',
                description2: '',
                buttonText: '',
                buttonLink: '',
                image: '',
                status: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentSlider(null);
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        if (!currentSlider) return;
        setCurrentSlider(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentSlider) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setCurrentSlider(prev => prev ? { ...prev, image: base64String } : null);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!currentSlider) return;
        setSaving(currentSlider.id);
        try {
            const isNew = currentSlider.id < 0;
            const url = isNew ? `${apiUrl}/sliders` : `${apiUrl}/sliders/${currentSlider.id}`;
            const method = isNew ? 'post' : 'put';
            
            const response = await request[method](url, currentSlider);
            if (response.data.success) {
                notify.success(`Slider ${isNew ? 'creado' : 'actualizado'} correctamente`);
                fetchSliders();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving slider:', error);
            notify.error('Error al guardar el slider');
        } finally {
            setSaving(null);
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm('¿Estás seguro de que deseas eliminar este slider?');
        if (!isConfirmed) return;
        
        setDeleting(id);
        try {
            const response = await request.delete(`${apiUrl}/sliders/${id}`);
            if (response.data.success) {
                notify.success('Slider eliminado correctamente');
                setSliders(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting slider:', error);
            notify.error('Error al eliminar el slider');
        } finally {
            setDeleting(null);
        }
    };

    const getImageUrl = (image: string) => {
        if (!image) return '';
        if (image.startsWith('data:') || image.startsWith('http')) return image;
        return `${apiUrl.replace('/api/v1', '')}/images/sliders/${image}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Sliders</h1>
                    <p className="text-gray-500 mt-2">Administra los banners principales de la página de inicio</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-red-200"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Slider
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sliders.map((slider, index) => (
                    <div key={slider.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                        <div className="relative aspect-video bg-gray-100">
                            {slider.image ? (
                                <img
                                    src={getImageUrl(slider.image)}
                                    alt={slider.title}
                                    className={`w-full h-full object-cover ${!slider.status ? 'opacity-50 grayscale' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                                    {index + 1}
                                </div>
                                {!slider.status && (
                                    <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center">
                                        Inactivo
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(slider)}
                                    className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 rounded-lg shadow-sm transition-colors"
                                    title="Editar"
                                >
                                    <Type className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(slider.id)}
                                    disabled={deleting === slider.id}
                                    className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-600 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                    title="Eliminar"
                                >
                                    {deleting === slider.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                                {slider.title || 'Sin título'}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {slider.description1} {slider.description2}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" /> {slider.buttonLink || 'Sin enlace'}
                                </span>
                                <button
                                    onClick={() => handleOpenModal(slider)}
                                    className="text-red-600 hover:text-red-700 font-bold text-sm"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {sliders.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No se encontraron sliders.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-4 text-red-600 font-bold hover:underline"
                        >
                            Crear el primero ahora
                        </button>
                    </div>
                )}
            </div>

            {/* Modal para Agregar/Editar */}
            {showModal && currentSlider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {currentSlider.id < 0 ? 'Nuevo Slider' : 'Editar Slider'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título Principal</label>
                                        <input
                                            type="text"
                                            value={currentSlider.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                            placeholder="Ej: CALIDAD GARANTIZADA"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción Línea 1</label>
                                        <input
                                            type="text"
                                            value={currentSlider.description1}
                                            onChange={(e) => handleInputChange('description1', e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                            placeholder="Ej: Los mejores repuestos"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción Línea 2</label>
                                        <input
                                            type="text"
                                            value={currentSlider.description2}
                                            onChange={(e) => handleInputChange('description2', e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                            placeholder="Ej: Para tu vehículo"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={currentSlider.status}
                                                    onChange={(e) => handleInputChange('status', e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${currentSlider.status ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${currentSlider.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">Slider Activo</span>
                                        </label>
                                        <p className="text-xs text-gray-400 mt-1">Si está desactivado, no se mostrará en la página principal.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen de Fondo</label>
                                    <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 aspect-video flex flex-col items-center justify-center transition-all hover:border-red-400">
                                        {currentSlider.image ? (
                                            <>
                                                <img
                                                    src={getImageUrl(currentSlider.image)}
                                                    alt="Vista previa"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg hover:scale-105 transition-transform">
                                                        <Upload className="w-4 h-4" /> Cambiar
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Upload className="w-8 h-8" />
                                                <span className="font-medium">Subir Imagen</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Texto Botón</label>
                                            <input
                                                type="text"
                                                value={currentSlider.buttonText}
                                                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                placeholder="Ver Más"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Enlace Botón</label>
                                            <input
                                                type="text"
                                                value={currentSlider.buttonLink}
                                                onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                placeholder="/products"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving !== null || !currentSlider.image}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-red-200"
                            >
                                {saving !== null ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {saving !== null ? 'Guardando...' : 'Guardar Slider'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sliders;