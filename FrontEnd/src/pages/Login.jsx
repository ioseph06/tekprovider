import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  // ============ ESTADO DEL FORMULARIO ============
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // ============ ESTADO DE LA AUTENTICACIÓN ============
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ============ EFECTOS ============
  // Si ya está autenticado, redirigir a home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Cargar email guardado si existe
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ============ MANEJADORES ============
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llamar a la función login del store
      await login(email, password);

      // Guardar email si "Recuérdame" está marcado
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }

      // La redirección ocurre en el useEffect cuando isAuthenticated cambia
    } catch (err) {
      console.error('Error en login:', err.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // ============ RENDER ============
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Encabezado */}
        <div className="login-header">
          <h1>🔐 Iniciar Sesión</h1>         
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="error-message">
            <span>❌</span>
            <p>{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">
              📧 Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isLoading}
              placeholder="tu@email.com"
              autoComplete="email"
              className="form-input"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password">
              🔑 Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={isLoading}
              placeholder="••••••••"
              autoComplete="current-password"
              className="form-input"
            />
          </div>



          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-submit ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Pie de página */}
        <div className="login-footer">
          <p>
   
            
          </p>
        </div>
      </div>

      {/* Lado derecho - Información */}
      <div className="login-side">
        <div className="side-content">
          <h2>Bienvenido</h2>
          <ul>
            <li>✨ Clientes </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
