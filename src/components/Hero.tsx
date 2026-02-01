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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        const response = await request.get(`${apiUrl}/sliders`);
        if (response.data.success) {
          const activeSliders = response.data.body.sliders.filter((s: Slider) => s.status === true);
          setSliders(activeSliders);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[55vh] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (sliders.length === 0) return null;

  const getImageUrl = (image: string) => {
    if (!image) return '';
    if (image.startsWith('data:') || image.startsWith('http')) return image;
    return `${apiUrl.replace('/api/v1', '')}/images/sliders/${image}`;
  };

  return (<>
   
    <div className="relative w-full overflow-hidden animate-in fade-in duration-1000">
      <style>{`
        .hero-swiper-custom {
          height: 100% !important;
        }
        .hero-swiper-custom .swiper-button-next,
        .hero-swiper-custom .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.3);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          transition: all 0.3s ease;
          z-index: 20;
        }
        .hero-swiper-custom .swiper-button-next:hover,
        .hero-swiper-custom .swiper-button-prev:hover {
          background: rgba(220, 38, 38, 0.8);
          transform: scale(1.1);
        }
        .hero-swiper-custom .swiper-pagination {
          bottom: 20px !important;
          z-index: 20;
        }
        .hero-swiper-custom .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.6;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        .hero-swiper-custom .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
          background: #dc2626 !important;
        }
        .swiper-navigation-icon{
          padding: 7px;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination'
        }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="hero-swiper-custom h-full"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={index} className="h-full">
            <div 
              className="relative w-full h-[55vh] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ 
                  backgroundImage: `url('${getImageUrl(slide.image)}')`,
                }}
              ></div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
              
              <div className="relative z-10 container mx-auto h-full flex flex-col items-start justify-end pb-12 px-6 md:px-12 lg:px-24">
                <div className="max-w-2xl animate-in fade-in slide-in-from-left-10 duration-700 p-6 sm:p-0">
                  <p className="text-xs sm:text-sm md:text-base font-light text-white/90 tracking-wider mb-2">
                    {slide.description1}
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight line-clamp-2 mb-2">
                    {slide.description2}
                  </h2>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-red-500 leading-tight line-clamp-2 mb-6">
                    {slide.title}
                  </h1>
                  {slide.buttonText && (
                    <a 
                      href={slide.buttonLink || '#'}
                      className="inline-flex items-center gap-2 bg-white text-black font-bold py-2.5 px-6 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      {slide.buttonText || 'CONOCE MÁS'}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Pagination Element */}
      <div className="swiper-pagination"></div>

      <div className="relative z-20">
        <HomeButtonInfo />
      </div>
    </div>
  </>);
};

export default Hero;