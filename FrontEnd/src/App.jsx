import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './context/ProtectedRoute';

// Páginas
import Login from './pages/Login';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Unauthorized from './pages/Unauthorized';

/**
 * Componente principal de la aplicación
 * Configura todas las rutas y la autenticación
 */
function App() {
  // ============ HOOKS ============
  const { isAuthenticated, initializeAuth } = useAuth();

  // ============ EFECTOS ============
  // Inicializar autenticación desde localStorage al cargar
  useEffect(() => {
    initializeAuth();
  }, []);

  // ============ RENDER ============
  return (

    <Router>
      <Routes>
        {/* ============ RUTAS PÚBLICAS ============ */}
        
        {/* Login - Redirigir a home si ya está autenticado */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* ============ RUTAS PROTEGIDAS ============ */}

        {/* Home - Página principal protegida */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Clientes - Tabla de clientes */}
        <Route
          path="/cliente"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />

        {/* Página de leads - Requiere permiso 'leads.ver' */}
        <Route
          path="/leads"
          element={
            <ProtectedRoute requiredPermission="leads.ver">
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>📋 Página de Leads</h1>
                <p>Aquí irá el componente para visualizar leads</p>
                <p>
                  Solo visible para usuarios con permiso{' '}
                  <code>leads.ver</code>
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Crear Lead - Requiere permiso 'leads.crear' */}
        <Route
          path="/leads/create"
          element={
            <ProtectedRoute requiredPermission="leads.crear">
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>➕ Crear Nuevo Lead</h1>
                <p>Aquí irá el formulario para crear leads</p>
                <p>
                  Solo visible para usuarios con permiso{' '}
                  <code>leads.crear</code>
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Avanzar Leads - Requiere permiso 'leads.avanzar' */}
        <Route
          path="/leads/advance"
          element={
            <ProtectedRoute requiredPermission="leads.avanzar">
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>⚡ Avanzar Leads</h1>
                <p>Aquí irá la interfaz para avanzar leads</p>
                <p>
                  Solo visible para usuarios con permiso{' '}
                  <code>leads.avanzar</code>
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Panel Admin - Requiere rol 'Admin' */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>⚙️ Panel de Administración</h1>
                <p>Aquí irá el panel de configuración del sistema</p>
                <p>Solo visible para administradores</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* ============ RUTAS DE ERROR ============ */}

        {/* Acceso Denegado - Sin permisos suficientes */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 404 - Página no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
