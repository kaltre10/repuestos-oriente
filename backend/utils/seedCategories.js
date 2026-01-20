import models from '../models/index.js';

const categoriesToSeed = [
  'Motor',
  'Transmisión y Embrague',
  'Suspensión y Dirección',
  'Sistema Eléctrico',
  'Sistema de Combustible',
  'Refrigeración',
  'Escape',
  'Filtros',
  'Carrocería y Accesorios Externos',
  'Interior y Confort',
  'Neumáticos y Rines',
  'Lubricantes y Refrigerantes',
  'Vidrios',
  'Frenos'
];

export const seedCategories = async () => {
  try {
    const { Category } = models;
    
    for (const categoryName of categoriesToSeed) {
      // Usar findOrCreate para evitar duplicados si la aplicación se reinicia
      const [category, created] = await Category.findOrCreate({
        where: { category: categoryName },
        defaults: { category: categoryName }
      });
      
      if (created) {
        console.log(`Categoría creada: ${categoryName}`);
      }
    }
    
    console.log('Proceso de seeding de categorías completado.');
  } catch (error) {
    console.error('Error al realizar el seeding de categorías:', error);
  }
};
