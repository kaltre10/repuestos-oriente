import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const Guard = ({ children, allow }: any) => {
    const [isAllow, setIsAllow] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const localUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (localUser && token) {
            const user = JSON.parse(localUser)
            console.log(user.role)
            const role = user.role
            const permit = allow.includes(role)
            console.log("permit: ", permit)
            setIsAllow(permit)
            if (!permit) navigate('/')
        } else {
            navigate('/')
        }
    }, [allow])

    return isAllow ? children : 'Error de autenticacion'
}

export default Guard