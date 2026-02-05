import models from '../models/index.js';

const categorySubcategoryMap = {
  "Motor": [
    "Pistones",
    "Anillos",
    "Cigüeñal",
    "Bielas",
    "Árbol de levas",
    "Válvulas",
    "Culata",
    "Juntas",
    "Bloque del motor"
  ],
  "Transmisión y Embrague": [
    "Caja de cambios",
    "Embrague",
    "Volante",
    "Palanca",
    "Ejes de transmisión"
  ],
  "Suspensión y Dirección": [
    "Amortiguadores",
    "Resortes",
    "Brazos de suspensión",
    "Rótulas",
    "Caja de dirección",
    "Bomba hidráulica"
  ],
  "Frenos": [
    "Pastillas",
    "Discos",
    "Tambores",
    "Zapatas",
    "Líquido de frenos",
    "Cilindros"
  ],
  "Sistema Eléctrico y Electrónico": [
    "Alternador",
    "Batería",
    "Motor de arranque",
    "Sensores",
    "Fusibles",
    "Relés",
    "ECU",
    "Bujias"
  ],
  "Sistema de Combustible": [
    "Bomba de gasolina",
    "Inyectores",
    "Carburador",
    "Filtros de combustible",
    "Tanque"
  ],
  "Refrigeración y Calefacción": [
    "Radiador",
    "Termostato",
    "Bomba de agua",
    "Ventilador",
    "Mangueras",
    "Calefactor"
  ],
  "Escape": [
    "Múltiple de escape",
    "Catalizador",
    "Silenciador",
    "Tubos"
  ],
  "Filtros": [
    "Filtro de aceite",
    "Filtro de aire",
    "Filtro de combustible",
    "Filtro de cabina"
  ],
  "Carrocería y Accesorios Externos": [
    "Puertas",
    "Capó",
    "Parachoques",
    "Guardabarros",
    "Espejos",
    "Faros",
    "Lunas"
  ],
  "Interior y Confort": [
    "Asientos",
    "Tablero",
    "Cinturones",
    "Alfombras",
    "Aire acondicionado",
    "Calefacción"
  ],
  "Neumáticos y Ruedas": [
    "Llantas",
    "Neumáticos",
    "Rines",
    "Válvulas",
    "Tapas"
  ],
  "Lubricantes y Líquidos": [
    "Aceite de motor",
    "Líquido de frenos",
    "Refrigerante",
    "Líquido de dirección"
  ]
};

export const seedCategories = async () => {
  try {
    const { Category, SubCategory } = models;
    
    for (const [categoryName, subcategories] of Object.entries(categorySubcategoryMap)) {
      // Usar findOrCreate para la categoría
      const [category, created] = await Category.findOrCreate({
        where: { category: categoryName },
        defaults: { category: categoryName }
      });
      
      // if (created) {
      //   console.log(`Categoría creada: ${categoryName}`);
      // }

      // Crear subcategorías para esta categoría
      for (const subcategoryName of subcategories) {
        const [subcategory, subCreated] = await SubCategory.findOrCreate({
          where: { 
            subCategory: subcategoryName,
            categoryId: category.id
          },
          defaults: { 
            subCategory: subcategoryName,
            categoryId: category.id
          }
        });

        // if (subCreated) {
        //   console.log(`  Subcategoría creada: ${subcategoryName} (Categoría: ${categoryName})`);
        // }
      }
    }
    
    // console.log('Proceso de seeding de categorías y subcategorías completado.');
  } catch (error) {
    console.error('Error al realizar el seeding de categorías y subcategorías:', error);
  }
};
