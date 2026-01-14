import { Sequelize } from 'sequelize';
import User from './User.js';

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
  User: User(sequelize),
};

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

export { sequelize, connectDB };
export default {
  sequelize,
  connectDB,
  ...models,
};
