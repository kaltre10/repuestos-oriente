import { connectDB } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { seedBrands } from './seedBrands.js';
import { seedCategories } from './seedCategories.js';
import { seedModels } from './seedModels.js';
import { seedSliders } from './seedSliders.js';

export const corsOptions = {
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (como apps móviles, curl, o instaladores locales)
        // o si el origen está en el FRONTEND_URL configurado
        const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}

export const startServer = async (app) => {
    try {
        await connectDB();

        await sequelize.sync({ alter: true });

        // Seed brands, categories and models after sync
        await seedBrands();
        await seedCategories();
        await seedModels();
        await seedSliders();

        const PORT = process.env.PORT || 3001;
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api/v1`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

