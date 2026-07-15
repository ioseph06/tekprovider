import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Componente para proteger rutas
 * 
 * Uso básico:
 * <ProtectedRoute>
 *   <Home />
 * </ProtectedRoute>
 * 
 * Con permiso requerido:
 * <ProtectedRoute requiredPermission="leads.ver">
 *   <LeadsPage />
 * </ProtectedRoute>
 * 
 * Con rol requerido:
 * <ProtectedRoute requiredRole="Admin">
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * Combinado:
 * <ProtectedRoute requiredPermission="leads.crear" requiredRole="Admin">
 *   <CreateLeadPage />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredRole,
  fallback = null 
}) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  // ============ VALIDACIONES ============

  // 1. Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si requiere un permiso específico y no lo tiene
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  // 3. Si requiere un rol específico y no lo tiene
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  // 4. Si todos está bien, retornar el componente
  return children;
};

export default ProtectedRoute;
