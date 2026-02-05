class Validate {

    string(data, message) {
        const typeString = (str) => typeof str === 'string'
        if (Array.isArray(data)) {
            data.forEach(element => {
                if (!typeString(element)) {
                    throw new Error(message || `Error de validación: se esperaba un String, se recibió ${typeof element}`)
                }
            })
        } else {
            if (!typeString(data)) {
                throw new Error(message || `Error de validación: se esperaba un String, se recibió ${typeof data}`)
            }
        }
        return true
    }

    number(data, message) {
        const typeNumber = (num) => typeof num === 'number'

        if (Array.isArray(data)) {
            data.forEach(element => {
                if (!typeNumber(element)) {
                    throw new Error(message || `Error de validación: se esperaba un Number, se recibió ${typeof element}`)
                }
            })
        } else {
            if (!typeNumber(data)) {
                throw new Error(message || `Error de validación: se esperaba un Number, se recibió ${typeof data}`)
            }
        }
        return true
    }

    required(data, message = "Error de validación: el dato es requerido") {
        if (Array.isArray(data)) {
            data.forEach((element, index) => {
                if (element === undefined || element === null || element === '') {
                    throw new Error(`${message} en la posición ${index}`)
                }
            })
        } else {
            if (data === undefined || data === null || data === '') {
                throw new Error(message)
            }
        }
        return true
    }

    email(email, message = "Error al validar email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            throw new Error(`${message}: ${email}`)
        }
        return true
    }

    isMongoId(data, message = 'Formato de ID incorrecto') {
        const regex = /^[0-9a-fA-F]{24}$/
        const is_MongoId = (id2) => regex.test(id2)

        if (Array.isArray(data)) {
            data.forEach((element, index) => {
                if (!is_MongoId(element)) {
                    throw new Error(`${message} en la posición ${index}`)
                }
            })
        } else {
            if (!is_MongoId(data)) {
                throw new Error(message)
            }
        }
        return true
    }

    objectEmpty(obj) {
        return !obj || Object.keys(obj).length === 0
    }
}

const validate = new Validate

export default validate