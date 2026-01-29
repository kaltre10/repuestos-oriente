import jwt from 'jsonwebtoken'
import responser from '../controllers/responser.js';

const validateToken = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authorization = req.headers.authorization || '';
        
        // Si no hay token, devolver error
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return responser.error({ res, message: 'Token no proporcionado', status: 401 });
        }
        
        // Extraer token (remover 'Bearer ')
        const token = authorization.slice(7);
        const DATA_TOKEN = process.env.JWT_SECRET;
        
        // Verificar token
        jwt.verify(token, DATA_TOKEN, (err, decoded) => {
            if (err) {
                console.error('Error al verificar token:', err);
                return responser.error({ res, message: 'Token inválido', status: 401 });
            } else {
                req.user = decoded;
                req.token = token;
                next();
            }
        });
    } catch (error) {
        console.error('Error en middleware de validación de token:', error);
        responser.error({ res, message: 'Error al intentar validar el token', status: 500 });
    }
}

export default validateToken