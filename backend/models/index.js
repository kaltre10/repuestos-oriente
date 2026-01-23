import { Sequelize } from 'sequelize';
import defineUser from './User.js';
import defineBrand from './Brand.js';
import defineCategory from './Category.js';
import defineSubCategory from './SubCategory.js';
import defineModel from './Model.js';
import defineProduct from './Product.js';
import defineProductImage from './ProductImage.js';
import defineConfig from './Config.js';
import defineSale from './Sale.js';
import defineQuestion from './Question.js';
import defineVisit from './Visit.js';
import definePaymentMethod from './Paymentmethod.js';
import defineSlider from './Slider.js';
import defineAdvertising from './Advertising.js';

import 'dotenv/config';

// MySQL database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'marketplace_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Initialize models
const models = {
  User: defineUser(sequelize),
  Brand: defineBrand(sequelize),
  Category: defineCategory(sequelize),
  SubCategory: defineSubCategory(sequelize),
  Model: defineModel(sequelize),
  Product: defineProduct(sequelize),
  ProductImage: defineProductImage(sequelize),
  Config: defineConfig(sequelize),
  Sale: defineSale(sequelize),
  Question: defineQuestion(sequelize),
    Visit: defineVisit(sequelize),
    PaymentMethod: definePaymentMethod(sequelize),
    Slider: defineSlider(sequelize),
    Advertising: defineAdvertising(sequelize),
  };

// Define associations
models.Sale.belongsTo(models.Product, {
  foreignKey: 'productId',
  as: 'product'
});

models.Sale.belongsTo(models.User, {
  foreignKey: 'buyerId',
  as: 'buyer'
});

models.Product.hasMany(models.Sale, {
  foreignKey: 'productId',
  as: 'sales'
});

models.User.hasMany(models.Sale, {
  foreignKey: 'buyerId',
  as: 'purchases'
});

models.Product.hasMany(models.ProductImage, {
  foreignKey: 'productId',
  as: 'images'
});

models.ProductImage.belongsTo(models.Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Question associations
models.Question.belongsTo(models.User, {
  foreignKey: 'clientId',
  as: 'client'
});

models.Question.belongsTo(models.Product, {
  foreignKey: 'productId',
  as: 'product'
});

models.Product.hasMany(models.Question, {
  foreignKey: 'productId',
  as: 'questions'
});

models.User.hasMany(models.Question, {
  foreignKey: 'clientId',
  as: 'questions'
});

// Category - SubCategory associations
models.Category.hasMany(models.SubCategory, {
  foreignKey: 'categoryId',
  as: 'subCategories'
});

models.SubCategory.belongsTo(models.Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Define associations if any
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export {
  sequelize,
  connectDB,
};

// Export individual models from the models object
export const {
  User,
  Brand,
  Category,
  SubCategory,
  Model,
  Product,
  ProductImage,
  Config,
  Sale,
  Question,
  Visit,
  PaymentMethod,
  Slider,
  Advertising,
} = models;

export default {
  sequelize,
  connectDB,
  ...models,
};
