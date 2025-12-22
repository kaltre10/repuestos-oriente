import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import slides from '../utils/slides.json'
import HomeButtonInfo from './HomeButtonInfo';

const Hero = () => {
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
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')`, height: '55vh' }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 flex flex-col items-start justify-center h-full text-white p-8 sm:p-12 md:p-24">
                <p className="text-base md:text-lg font-light tracking-widest">{slide.subtitle}</p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold my-2">{slide.title}</h2>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-500 mb-6">{slide.main}</h1>
                <button className="bg-white text-black font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-red-500 hover:text-white transition-colors text-sm md:text-base">
                  CONOCE MÁS
                </button>
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