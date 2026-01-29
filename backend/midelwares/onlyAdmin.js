import jwt from 'jsonwebtoken'
import responser from '../controllers/responser.js';

const onlyAdmin = (req, res, next) => {

    const DATA_TOKEN = process.env.JWT_SECRET
    const authorization = req.headers.authorization || ''
    const token = authorization.slice(7)
    try {
        jwt.verify(token, DATA_TOKEN, (err, decoded) => {
            if (err) {
                throw 'Error de validacion del token'
            } else {
                console.log(decoded)
                decoded.role !== 'admin' && (() => { throw 'No posee permisos de administrador' })()
                req.user = decoded
                req.token = token
                next()
            }
        })
    } catch (error) {
        responser.error({ res, message: error?.message || 'Error al intentar validar el token' })
    }
}

export default onlyAdmin