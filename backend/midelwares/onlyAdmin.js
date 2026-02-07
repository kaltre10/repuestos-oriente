import jwt from 'jsonwebtoken'
import responser from '../controllers/responser.js';

const onlyAdmin = (req, res, next) => {
    try {
        // console.log('--- ONLY ADMIN START ---');
        const authorization = req.headers.authorization || '';
        
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // console.warn('onlyAdmin: Token no proporcionado');
            return responser.error({ res, message: 'Token no proporcionado', status: 401 });
        }
        
        const token = authorization.slice(7);
        const DATA_TOKEN = process.env.JWT_SECRET;
        
        if (!DATA_TOKEN) {
            // console.error('onlyAdmin: JWT_SECRET no configurado');
            return responser.error({ res, message: 'Error interno del servidor', status: 500 });
        }

        jwt.verify(token, DATA_TOKEN, (err, decoded) => {
            if (err) {
                // console.error('onlyAdmin: Token inválido:', err.message);
                return responser.error({ res, message: 'Token inválido o expirado', status: 401 });
            }
            
            // console.log('onlyAdmin: Rol del usuario:', decoded.role);
            if (decoded.role !== 'admin') {
                // console.warn('onlyAdmin: Acceso denegado. Rol esperado: admin, Rol actual:', decoded.role);
                return responser.error({ res, message: 'No posee permisos de administrador', status: 403 });
            }

            // console.log('onlyAdmin: Acceso concedido para:', decoded.email || decoded.id);
            req.user = decoded;
            req.token = token;
            next();
        });
    } catch (error) {
        console.error('Error en middleware onlyAdmin:', error);
        responser.error({ res, message: 'Error al validar permisos de administrador', status: 500 });
    }
}

export default onlyAdmin;