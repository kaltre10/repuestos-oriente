import models from '../models/index.js';

const brandsToSeed = [
  'JAC', 'Toyota', 'Changan', 'Chevrolet', 'Ford', 'Hyundai', 'Kia', 'Fiat', 
  'Foton', 'Jeep', 'Chery', 'Mitsubishi', 'RAM', 'Renault', 'Suzuki', 'Subaru', 
  'Chrysler', 'Tesla', 'Donfeng', 'Mini', 'Audi', 'Peugeot', 'Lexus', 'Mazda', 
  'Land Rober', 'Mercedes Benz', 'Dodge', 'Nissan', 'Volswagen', 'Honda', 'Bmw'
];

export const seedBrands = async () => {
  try {
    const { Brand } = models;
    
    for (const brandName of brandsToSeed) {
      // Usar findOrCreate para evitar duplicados si la aplicación se reinicia
      const [brand, created] = await Brand.findOrCreate({
        where: { brand: brandName },
        defaults: { brand: brandName }
      });
      
      if (created) {
        console.log(`Marca creada: ${brandName}`);
      }
    }
    
    console.log('Proceso de seeding de marcas completado.');
  } catch (error) {
    console.error('Error al realizar el seeding de marcas:', error);
  }
};
