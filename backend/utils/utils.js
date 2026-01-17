import { connectDB, sequelize } from '../models/index.js';
import { seedBrands } from './seedBrands.js';


export const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}

export const startServer = async (app) => {
    try {
        await connectDB();

        await sequelize.sync();

        // Seed brands after sync
        await seedBrands();

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
