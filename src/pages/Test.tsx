import Header from "../components/Header"
import HomeButtonInfo from "../components/HomeButtonInfo"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import slides from '../utils/slides.json'
//manueltest123456
const Test = () => {
    return (<>
        <div className="h-screen flex flex-col">
            <Header />
            <div id="div-superior" className="flex-1 relative bg-red-950">
                <div
                    id="div-imagen-fondo"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1694016219825-62a6a5697027?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
                >

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        loop={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className=""
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="bg-cover bg-center"
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
                </div>

                <div
                    id="div-inferior"
                    className="absolute bottom-0 left-0 w-full bg-red-50 p-4"
                >
                    <HomeButtonInfo />
                </div>
            </div>
        </div>
        <h1>otra seccion</h1>
    </>


    )
}

export default Test