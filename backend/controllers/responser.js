const success = ({ res, message = 'success', body = {}, status = 200 }) => {
    res.status(status).json({
        success: true,
        body,
        message,
        status
    })
}

const error = ({ res, message = "Error desconocido", body = {}, status = 500 }) => {
    res.status(status).json({
        success: false,
        body,
        message,
        status
    })
}

export default { success, error }