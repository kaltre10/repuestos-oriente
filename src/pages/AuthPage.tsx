import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import useAuth from '../hooks/useAuth';
import useStore from '../states/global';

// import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

const AuthPage = () => {
  const { user } = useStore();
  // const navigate = useNavigate();

  const { isLogin, handleSubmit, handleInputChange,
    formData, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    rememberCredentials, handleRemember, loading, error, setIsLogin,
    isForgotPassword, setIsForgotPassword, handleForgotPassword, successMessage, handleGoogleAuth } = useAuth()
    
  // Eliminamos el useEffect que causaba el bucle de navegación duplicada

  if (user) return null; // Evita el parpadeo de la página si ya hay un usuario

  document.title = `Repuestos Picha - ${isLogin ? "Login" : "Registro"}`;
  if (isForgotPassword) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white shadow sm:rounded-lg pb-4">
           
              <div className="bg-logo">
                 <Link to='/'><img src={logo} alt="Logo" /></Link>
              </div>
            
            <div className='px-8 py-2'>
              <div className="mb-5 text-center text-1xl font-extrabold text-gray-900">
                Recuperar Contraseña
              </div>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              
              <form className="space-y-5" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-md">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="text-green-600 text-sm text-center bg-green-100 p-2 rounded-md">
                    {successMessage}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="cursor-pointer text-sm text-red-600 hover:text-red-500"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isLogin ? 'h-screen' : ''} bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8`}>
      <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow sm:rounded-lg pb-4">
          <div className="bg-logo">
            <Link to='/'><img src={logo} alt="Logo" /></Link>
          </div>
          <div className='px-8 py-2'>
            <div className="mb-5 text-center text-1xl font-extrabold text-gray-900">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm pr-10"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm pr-10"
                      placeholder="Confirma tu contraseña"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-credentials"
                    name="remember-credentials"
                    type="checkbox"
                    checked={rememberCredentials}
                    onChange={(e) => handleRemember(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-credentials" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    Recordar
                  </label>
                </div>

                {isLogin && (
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-2 px-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center w-full overflow-hidden">
              <GoogleLogin
                onSuccess={(credentialResponse: CredentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleAuth(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                theme="outline"
                size="large"
                shape="rectangular"
                width="100%"
                text="continue_with"
                // locale="es" 
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="cursor-pointer text-sm text-red-600 hover:text-red-500"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
