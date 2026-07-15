import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // ============ ESTADO ============
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // ============ ACCIONES ============

  // Establecer datos del usuario
  setUser: (userData) => {
    set({ user: userData });
  },

  // Establecer tokens
  setTokens: (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    set({
      token,
      refreshToken,
      isAuthenticated: true,
    });
  },

  // Establecer loading
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Establecer error
  setError: (error) => {
    set({ error });
  },

  // ============ LOGIN ============
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5009/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();

      // Guardar datos del usuario
      const userData = {
        email: data.email,
        id: data.id,
        roles: data.roles,
        permisos: data.permisos,
        expiration: data.expiration,
      };

      // Actualizar estado
      set({
        user: userData,
        token: data.token,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // ============ REFRESH TOKEN ============
  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:8080/api/Auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      set({
        token: data.token,
        refreshToken: data.refreshToken,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      return data.token;
    } catch (error) {
      // Si falla el refresh, hacer logout
      set({
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        user: null,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // ============ LOGOUT ============
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // ============ VERIFICACIONES ============

  // Verificar si tiene un permiso
  hasPermission: (permiso) => {
    const state = get();
    return state.user?.permisos?.includes(permiso) || false;
  },

  // Verificar si tiene un rol
  hasRole: (rol) => {
    const state = get();
    return state.user?.roles?.includes(rol) || false;
  },

  // Verificar si el token está expirado
  isTokenExpired: () => {
    const state = get();
    if (!state.user?.expiration) return true;
    return new Date(state.user.expiration) < new Date();
  },

  // Inicializar desde localStorage (útil al recargar la página)
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
      }
    }
  },
}));

//export default useAuthStore;
//export { useAuthStore };