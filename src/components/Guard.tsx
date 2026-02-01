import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useStore from "../states/global"

const Guard = ({ children, allow }: { children: React.ReactNode, allow: string[] }) => {
    const { user } = useStore()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    // Calculamos el permiso directamente en el render
    const hasAccess = user && token && allow.includes(user.role)

    useEffect(() => {
        if (!user || !token) {
            navigate('/')
        } else if (!allow.includes(user.role)) {
            navigate('/auth')
        }
    }, [user, token, navigate, JSON.stringify(allow)])

    // Si no tiene acceso, no renderizamos nada para evitar parpadeos
    if (!hasAccess) return null

    return <>{children}</>
}

export default Guard