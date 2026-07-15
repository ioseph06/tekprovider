import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Home.css';

export default function Home() {
  // ============ HOOKS ============
  const { user, logout, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();

  // ============ MANEJADORES ============
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // ============ RENDER ============
  return (
    <div className="home-container">
      {/* ============ NAVBAR ============ */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h1 className="navbar-title">📊 Dashboard</h1>
          </div>
          <div className="navbar-right">
            <span className="user-email">👤 {user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* ============ CONTENIDO PRINCIPAL ============ */}
      <div className="content">
        {/* Grid de Información */}
        <div className="info-grid">
          {/* Card: Información del Usuario */}
          <div className="info-card">
            <div className="card-header">
              <h2>👤 Información del Usuario</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value info-mono">{user?.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Rol:</span>
                <div className="roles-container">
                  {user?.roles?.map((rol) => (
                    <span key={rol} className="badge badge-role">
                      {rol}
                    </span>
                  ))}
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Sesión expira:</span>
                <span className="info-value">
                  {new Date(user?.expiration).toLocaleString('es-ES')}
                </span>
              </div>
 <h2 style={{color: "red"}}>🔐 Permisos</h2>
             <div className="permissions-grid">
                {user?.permisos && user.permisos.length > 0 ? (
                  user.permisos.map((permiso) => (
                    <span key={permiso} className="badge badge-permission">
                      ✓ {permiso}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No tienes permisos asignados</p>
                )}
              </div>

            </div>
          </div>

          {/* Card: Permisos */}
          <div className="info-card">
            <div className="card-header">
              <h2>🔐 Opciones</h2>
            </div>
            <div className="card-body">
             {hasPermission('cliente.ver') && (
              <button
                onClick={() => handleNavigate('/cliente')}
                className="option-btn cliente"
              >
                <span className="btn-icon">👁️</span>
                <span className="btn-text">Ver cliente</span>
                <span className="btn-desc">Visualiza todos los cliente</span>
              </button>
            )}
            </div>
          </div>
        </div>

   


      </div>
    </div>
  );
}
