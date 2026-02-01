import request from "../utils/request";
import { apiUrl } from "../utils/utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../states/global";

const useAuth = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '', });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberCredentials, setRememberCredentials] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useStore();

    const handleRemember = (state: boolean) => {
        setRememberCredentials(state)
        if (state) {
            localStorage.setItem('savedEmail', formData.email)
            localStorage.setItem('savedPassword', formData.password)
        } else {
            localStorage.removeItem('savedEmail')
            localStorage.removeItem('savedPassword')
        }
        localStorage.setItem('remember', String(state))
    }

    useEffect(() => {
        const remember = localStorage.getItem('remember') || 'false';
        const r = remember === 'true' ? true : false
        if (r) {
            const savedEmail = localStorage.getItem('savedEmail');
            const savedPassword = localStorage.getItem('savedPassword');
            if (savedEmail) setFormData(prev => ({ ...prev, email: savedEmail }));
            if (savedPassword) setFormData(prev => ({ ...prev, password: savedPassword }));
        }
        setRememberCredentials(r)
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'email' && rememberCredentials) {
            localStorage.setItem('savedEmail', e.target.value)
        } else if (e.target.name === 'password' && rememberCredentials) {
            localStorage.setItem('savedPassword', e.target.value)
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        // Save credentials to localStorage if remember is checked
        if (rememberCredentials) {
            localStorage.setItem('savedEmail', formData.email);
            localStorage.setItem('savedPassword', formData.password);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await request.post(`${apiUrl}${endpoint}`, formData);
            const data = response.data;

            if (!data || (data.status !== 200 && data.status !== 201)) {
                throw new Error(data?.message || 'Login fallido');
            }

            // Store user data and token
            localStorage.setItem('token', data.body.token);

            // Save user data without password
            const userToSave = { ...data.body.user };
            delete userToSave.password;
            localStorage.setItem('user', JSON.stringify(userToSave));

            setUser(userToSave);
            const user = userToSave;
            if (user.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/clients/profile');
            }
        } catch (err: any) {
            console.log(err)
            setError(err?.response?.data?.message || err?.message || 'Ocurrio un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await request.post(`${apiUrl}/auth/forgot-password`, { email: formData.email });
            const data = response.data;

            if (data.status === 200 || data.status === 201) {
                setSuccessMessage(data.message);
            } else {
                setError(data.message || 'Error al procesar la solicitud');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Ocurrio un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (token: string, newPassword: string) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await request.post(`${apiUrl}/auth/reset-password`, { token, newPassword });
            const data = response.data;

            if (data.status === 200 || data.status === 201) {
                setSuccessMessage(data.message);
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            } else {
                setError(data.message || 'Error al restablecer la contraseña');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || 'Ocurrio un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async (credential: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await request.post(`${apiUrl}/auth/google`, { token: credential });
            const data = response.data;

            if (!data || (data.status !== 200 && data.status !== 201)) {
                throw new Error(data?.message || 'Autenticación con Google fallida');
            }

            // Store user data and token
            localStorage.setItem('token', data.body.token);

            // Save user data without password
            const userToSave = { ...data.body.user };
            delete userToSave.password;
            localStorage.setItem('user', JSON.stringify(userToSave));

            setUser(userToSave);
            const user = userToSave;
            if (user.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/clients/profile');
            }
        } catch (err: any) {
            console.error('Error en Google Auth:', err);
            setError(err?.response?.data?.message || err?.message || 'Ocurrió un error con Google');
        } finally {
            setLoading(false);
        }
    };

    return {
        isLogin, handleSubmit, handleInputChange,
        formData, showPassword, setShowPassword,
        showConfirmPassword, setShowConfirmPassword,
        rememberCredentials,
        handleRemember, loading, error, setIsLogin,
        isForgotPassword, setIsForgotPassword,
        handleForgotPassword, handleResetPassword,
        successMessage, handleGoogleAuth
    }
}

export default useAuth