import models from '../models/index.js';

const modelsByBrand = { 
  "Audi": ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "Q7", "e-tron"], 
  "BMW": ["Serie 1", "Serie 3", "Serie 5", "X1", "X3", "X5", "X6", "iX"], 
  "Changan": ["Alsvin", "CS15", "CS35 Plus", "CS55 Plus", "UNI-T", "Hunter"], 
  "Chery": ["Tiggo 2", "Tiggo 4", "Tiggo 7 Pro", "Tiggo 8 Pro", "Arrizo 5"], 
  "Chevrolet": ["Onix", "Sail", "Tracker", "Captiva", "Silverado", "Colorado", "Camaro"], 
  "Chrysler": ["Pacifica", "300C"], 
  "Dodge": ["Challenger", "Charger", "Durango", "Journey"], 
  "Dongfeng": ["Joyear X3", "T5 Evo", "Rich 6", "SX5", "Captain"], 
  "Fiat": ["500", "Cronos", "Pulse", "Fastback", "Strada", "Fiorino"], 
  "Ford": ["Fiesta", "Focus", "EcoSport", "Territory", "Ranger", "F-150", "Mustang", "Explorer"], 
  "Foton": ["Tunland", "View", "Gratour", "Aumark"], 
  "Honda": ["Civic", "Accord", "City", "HR-V", "CR-V", "Pilot"], 
  "Hyundai": ["i10", "Accent", "Elantra", "Creta", "Tucson", "Santa Fe", "Kona", "Ioniq 5"], 
  "JAC": ["JS2", "JS3", "JS4", "JS8", "T6", "T8 Pro", "Sunray"], 
  "Jeep": ["Renegade", "Compass", "Commander", "Grand Cherokee", "Wrangler", "Gladiator"], 
  "Kia": ["Rio", "Soluto", "Cerato", "Sportage", "Seltos", "Sorento", "EV6", "Frontier"], 
  "Land Rover": ["Defender", "Discovery", "Range Rover Evoque", "Range Rover Velar", "Sport"], 
  "Lexus": ["IS", "ES", "UX", "NX", "RX", "LX"], 
  "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-90", "MX-5"], 
  "Mercedes Benz": ["Clase A", "Clase C", "Clase E", "GLA", "GLC", "GLE", "EQE", "Sprinter"], 
  "Mini": ["Cooper 3 Door", "Cooper 5 Door", "Countryman", "Clubman"], 
  "Mitsubishi": ["Mirage", "Lancer", "ASX", "Eclipse Cross", "Montero Sport", "L200"], 
  "Nissan": ["Versa", "Sentra", "March", "Kicks", "Qashqai", "X-Trail", "Frontier", "Navara", "Leaf"], 
  "Peugeot": ["208", "308", "2008", "3008", "5008", "Partner"], 
  "RAM": ["700", "1000", "1500", "2500", "V700"], 
  "Renault": ["Kwid", "Logan", "Sandero", "Stepway", "Duster", "Koleos", "Oroch", "Master"], 
  "Subaru": ["Impreza", "XV", "Crosstrek", "Forester", "Outback", "WRX"], 
  "Suzuki": ["Swift", "Celerio", "Baleno", "Vitara", "S-Cross", "Jimny", "Ertiga"], 
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"], 
  "Toyota": ["Yaris", "Corolla", "Camry", "Corolla Cross", "RAV4", "Hilux", "Land Cruiser", "SW4"], 
  "Volkswagen": ["Gol", "Polo", "Virtus", "T-Cross", "Nivus", "Taos", "Tiguan", "Amarok", "ID.4"] 
};

export const seedModels = async () => {
  try {
    const { Brand, Model } = models;
    
    for (const [brandName, modelList] of Object.entries(modelsByBrand)) {
      // Find the brand ID
      const brand = await Brand.findOne({ where: { brand: brandName } });
      
      if (!brand) {
        console.warn(`Brand not found for seeding models: ${brandName}`);
        continue;
      }
      
      for (const modelName of modelList) {
        // Usar findOrCreate para evitar duplicados
        const [model, created] = await Model.findOrCreate({
          where: { 
            model: modelName,
            brandId: brand.id
          },
          defaults: { 
            model: modelName,
            brandId: brand.id
          }
        });
        
        if (created) {
          console.log(`Modelo creado: ${modelName} (${brandName})`);
        }
      }
    }
    
    console.log('Proceso de seeding de modelos completado.');
  } catch (error) {
    console.error('Error al realizar el seeding de modelos:', error);
  }
};
