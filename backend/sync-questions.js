import { sequelize } from './models/index.js';

async function syncQuestions() {
  try {
    console.log('Synchronizing Questions table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NOT NULL,
        productId INT NOT NULL,
        questionText TEXT NOT NULL,
        answerText TEXT NULL,
        status INT NOT NULL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('Questions table synchronized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing Questions table:', error);
    process.exit(1);
  }
}

syncQuestions();
