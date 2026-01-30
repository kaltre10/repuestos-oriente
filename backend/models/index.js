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
import defineOrder from './Order.js';
import defineQuestion from './Question.js';
import defineVisit from './Visit.js';
import definePaymentMethod from './Paymentmethod.js';
import definePaymentType from './Paymenttype.js';
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
    timezone: '-04:30', // Zona horaria de Venezuela (UTC-4:30)
    dialectOptions: {
      timezone: '-04:30', // Configuración adicional para MySQL
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
  Order: defineOrder(sequelize),
  Question: defineQuestion(sequelize),
  Visit: defineVisit(sequelize),
  PaymentMethod: definePaymentMethod(sequelize),
  PaymentType: definePaymentType(sequelize),
  Slider: defineSlider(sequelize),
  Advertising: defineAdvertising(sequelize),
};

// Define associations
models.Sale.belongsTo(models.Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Sale belongs to Order - this is the key association for the new structure
models.Sale.belongsTo(models.Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Order has many Sales
models.Order.hasMany(models.Sale, {
  foreignKey: 'orderId',
  as: 'sales'
});

// Order belongs to User
models.Order.belongsTo(models.User, {
  foreignKey: 'buyerId',
  as: 'buyer'
});

// Order belongs to PaymentMethod
models.Order.belongsTo(models.PaymentMethod, {
  foreignKey: 'paymentMethodId',
  as: 'paymentMethod'
});

// PaymentMethod has many Orders
models.PaymentMethod.hasMany(models.Order, {
  foreignKey: 'paymentMethodId',
  as: 'orders'
});

// User has many Orders
models.User.hasMany(models.Order, {
  foreignKey: 'buyerId',
  as: 'orders'
});

// User has many Sales (for backward compatibility)
models.User.hasMany(models.Sale, {
  foreignKey: 'buyerId',
  as: 'purchases'
});

// Product has many Sales
models.Product.hasMany(models.Sale, {
  foreignKey: 'productId',
  as: 'sales'
});

// Sale belongs to User (for backward compatibility)
models.Sale.belongsTo(models.User, {
  foreignKey: 'buyerId',
  as: 'buyer'
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

// Payment associations
models.PaymentMethod.belongsTo(models.PaymentType, {
  foreignKey: 'paymentTypeId',
  as: 'paymentType'
});

models.PaymentType.hasMany(models.PaymentMethod, {
  foreignKey: 'paymentTypeId',
  as: 'paymentMethods'
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
  Order,
  Question,
  Visit,
  PaymentMethod,
  PaymentType,
  Slider,
  Advertising,
} = models;

export default {
  sequelize,
  connectDB,
  ...models,
};
