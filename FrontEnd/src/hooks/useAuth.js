import { useAuthStore } from '../stores/authStore';

/**
 * Hook personalizado para acceder a la autenticación
 * Uso: const { user, login, logout } = useAuth();
 * 
 * IMPORTANTE: Este hook usa selectores para evitar re-renders innecesarios
 */
export const useAuth = () => {
  // Usar selectores individuales para cada valor
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  // Acciones (no cambian, son funciones)
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);

  // Verificaciones
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasRole = useAuthStore((state) => state.hasRole);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  return {
    // ESTADO
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,

    // ACCIONES
    login,
    logout,
    setUser,
    setTokens,
    setLoading,
    setError,
    refreshAccessToken,

    // VERIFICACIONES
    hasPermission,
    hasRole,
    isTokenExpired,
    initializeAuth,
  };
};

export default useAuth;