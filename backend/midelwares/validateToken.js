import jwt from 'jsonwebtoken'
import responser from '../controllers/responser.js';

const validateToken = (req, res, next) => {
    try {
        // console.log('--- VALIDATE TOKEN START ---');
        // Obtener token del header Authorization
        const authorization = req.headers.authorization || '';
        // console.log('Authorization Header:', authorization ? 'Presente' : 'Ausente');
        
        // Si no hay token, devolver error
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // console.warn('validateToken: Token no proporcionado o formato inválido');
            return responser.error({ res, message: 'Token no proporcionado', status: 401 });
        }
        
        // Extraer token (remover 'Bearer ')
        const token = authorization.slice(7);
        const DATA_TOKEN = process.env.JWT_SECRET;
        
        // Verificar token
        jwt.verify(token, DATA_TOKEN, (err, decoded) => {
            if (err) {
                console.error('Error al verificar token:', err.name, err.message);
                return responser.error({ res, message: 'Token inválido', status: 401 });
            } else {
                console.log('Token verificado correctamente para:', decoded.email || decoded.id);
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