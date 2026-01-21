import models from '../models/index.js';

const slidersToSeed = [
  {
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description1: "EDICIÓN DEPORTIVA",
    description2: "NUEVOS INGRESOS",
    title: "LLANTAS DEPORTIVAS",
    buttonText: "CONOCE MÁS",
    buttonLink: "/productos"
  },
  {
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description1: "MEJORA DE RENDIMIENTO",
    description2: "ÚLTIMOS ESCAPES",
    title: "SIENTE EL PODER",
    buttonText: "CONOCE MÁS",
    buttonLink: "/productos"
  },
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description1: "SERIE CLÁSICA",
    description2: "RINES VINTAGE",
    title: "DISEÑO ATEMPORAL",
    buttonText: "CONOCE MÁS",
    buttonLink: "/productos"
  }
];

export const seedSliders = async () => {
  try {
    const { Slider } = models;
    
    const count = await Slider.count();
    if (count === 0) {
      for (const sliderData of slidersToSeed) {
        await Slider.create(sliderData);
        console.log(`Slider creado: ${sliderData.title}`);
      }
      console.log('Proceso de seeding de sliders completado.');
    } else {
      console.log('Los sliders ya existen, omitiendo seeding.');
    }
  } catch (error) {
    console.error('Error al realizar el seeding de sliders:', error);
  }
};
