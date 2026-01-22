import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import request from '../utils/request'
import { apiUrl } from '../utils/utils'

interface Advertising {
    id: number;
    image: string;
    link: string;
    buttonText: string;
    status: boolean;
}

const AdvertisingModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [advertising, setAdvertising] = useState<Advertising | null>(null)

    useEffect(() => {
        const fetchActiveAdvertising = async () => {
            try {
                const response = await request.get(`${apiUrl}/advertising/active`);
                const advertisingData = response.data.body;
                const id = advertisingData.id;
                const advertisingId = localStorage.getItem(`advertisingId`);



                if (response.data.success && response.data.body) {
                    setAdvertising(response.data.body);
                    if (id !== Number(advertisingId)) {
                        setIsOpen(true);
                    }
                }

            } catch (error) {
                console.error('Error fetching active advertising:', error);
            }
        };

        fetchActiveAdvertising();
    }, [])

    const closeModal = () => {
        setIsOpen(false)
        if (!advertising) return;
        localStorage.setItem(`advertisingId`, advertising.id.toString());
    }

    if (!isOpen || !advertising) return null;

    const getImageUrl = (img: string) => {
        if (!img) return '';
        if (img.startsWith('data:') || img.startsWith('http')) return img;
        return `${apiUrl.replace('/api/v1', '')}/images/advertising/${img}`;
    };

    const handleAction = () => {
        if (advertising.link) {
            window.open(advertising.link, '_blank');
        }
    };

    return (
        <>
            <div className="bg-modal" onClick={closeModal}>
                <div className="body-modal" onClick={(e) => e.stopPropagation()}>
                    <img src={getImageUrl(advertising.image)} alt="Publicidad" className="rounded-lg shadow-2xl" />
                    <div className="text-white close-modal-btn">
                        <button onClick={closeModal} className='z-[110] p-1 rounded-full btn-close-pub bg-gray-500'>
                            <X size={24} />
                        </button>
                    </div>
                    {advertising.link && (
                        <button
                            onClick={handleAction}
                            className='shadow absolute bottom-6 px-8 z-[110] bg-white text-black py-2.5 rounded-full hover:bg-gray-100 transition-all font-bold transform hover:scale-105 active:scale-95'
                        >
                            {advertising.buttonText || 'Ver más'}
                        </button>
                    )}
                </div>
            </div>
        </>)

}

export default AdvertisingModal