import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import HomeButtonInfo from './HomeButtonInfo';
import { useState, useEffect } from 'react';
import request from '../utils/request';
import { apiUrl } from '../utils/utils';

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

const Hero = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await request.get(`${apiUrl}/sliders`);
        if (response.data.success) {
          const activeSliders = response.data.body.sliders.filter((s: Slider) => s.status === true);
          setSliders(activeSliders);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      }
    };
    fetchSliders();
  }, []);

  if (sliders.length === 0) return null;

  const getImageUrl = (image: string) => {
    if (!image) return '';
    if (image.startsWith('data:') || image.startsWith('http')) return image;
    return `${apiUrl.replace('/api/v1', '')}/images/sliders/${image}`;
  };

  return (
    <div className="">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="bg-red-200"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="bg-cover bg-center"
              style={{ 
                backgroundImage: `url('${getImageUrl(slide.image)}')`, 
                height: '55vh' 
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 flex flex-col items-start justify-center h-full text-white p-8 sm:p-12 md:p-24">
                <p className="text-base md:text-lg font-light tracking-widest">{slide.description1}</p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold my-2">{slide.description2}</h2>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-500 mb-6">{slide.title}</h1>
                <a 
                  href={slide.buttonLink || '#'}
                  className="bg-white text-black font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-red-500 hover:text-white transition-colors text-sm md:text-base inline-block"
                >
                  {slide.buttonText || 'CONOCE MÁS'}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div>
        <HomeButtonInfo />
      </div>
    </div>
  );
};

export default Hero;