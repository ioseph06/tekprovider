import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Unauthorized.css';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="unauthorized-container">
      <div className="error-box">
        <div className="error-icon">🔒</div>
        <h1>Acceso Denegado</h1>
        <p className="error-message">
          No tienes los permisos suficientes para acceder a esta página.
        </p>

        {user && (
          <div className="user-info">
            <p>
              <strong>Usuario:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.roles?.join(', ') || 'Sin asignar'}
            </p>
          </div>
        )}

        <div className="button-group">
          <button onClick={handleGoHome} className="btn btn-primary">
            ← Volver al Inicio
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            🚪 Cerrar Sesión
          </button>
        </div>

        <div className="help-text">
          <p>
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
