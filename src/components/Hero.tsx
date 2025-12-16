import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Truck, ShieldCheck, Award } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subtitle: 'EDICIÓN DEPORTIVA',
    title: 'NUEVOS INGRESOS',
    main: 'LLANTAS DEPORTIVAS',
  },
  {
    image: 'https://images.unsplash.com/photo-1617083959539-21781ae769dd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subtitle: 'MEJORA DE RENDIMIENTO',
    title: 'ÚLTIMOS ESCAPES',
    main: 'SIENTE EL PODER',
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subtitle: 'SERIE CLÁSICA',
    title: 'RINES VINTAGE',
    main: 'DISEÑO ATEMPORAL',
  },
];

const Hero = () => {
  return (
    <div className="relative h-[calc(100vh-120px)]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div 
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 flex flex-col items-start justify-center h-full text-white p-8 sm:p-12 md:p-24">
                <p className="text-base md:text-lg font-light tracking-widest">{slide.subtitle}</p>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold my-2">{slide.title}</h2>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-red-500 mb-6">{slide.main}</h1>
                <button className="bg-white text-black font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-red-500 hover:text-white transition-colors text-sm md:text-base">
                  CONOCE MÁS
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-gray-800 py-4 md:py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 md:p-4 rounded-full">
                <Truck size={24} md:size={32} />
              </div>
              <div>
                <h3 className="font-bold text-red-500 text-sm md:text-base">ENVÍO GRATIS</h3>
                <p className="text-xs md:text-sm">en pedidos superiores a $200</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 md:p-4 rounded-full">
                <ShieldCheck size={24} md:size={32} />
              </div>
              <div>
                <h3 className="font-bold text-red-500 text-sm md:text-base">PAGO SEGURO</h3>
                <p className="text-xs md:text-sm">Pago Movil, Transferenia, Binance y Visa</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 md:p-4 rounded-full">
                <Award size={24} md:size={32} />
              </div>
              <div>
                <h3 className="font-bold text-red-500 text-sm md:text-base">1 AÑO DE GARANTÍA</h3>
                <p className="text-xs md:text-sm">Todos nuestros productos están cubiertos por un año contra defectos de fabricación</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;