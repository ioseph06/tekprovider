import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Configuración de la API
const API_BASE_URL = 'http://localhost:5009'; // Cambia esto al puerto de tu backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables para controlar el refresh de token
let isRefreshing = false;
let failedQueue = [];

// Procesar la cola de peticiones fallidas
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// ============ INTERCEPTOR DE REQUEST ============
// Añade el token JWT a cada petición saliente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ INTERCEPTOR DE RESPONSE ============
// Maneja errores 401 (token expirado) y ejecuta refresh automático
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla tal cual
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized - Token expirado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Si ya está en proceso de refresh, esperar en la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Marcar que estamos refreshing
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token
        const { refreshAccessToken } = useAuthStore.getState();
        const newToken = await refreshAccessToken();
        
        // Usar el nuevo token para la petición original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Procesar la cola de peticiones fallidas
        processQueue(null, newToken);
        
        // Reintentar la petición original
        return api(originalRequest);
      } catch (err) {
        // Si falla el refresh, procesar la cola con error
        processQueue(err, null);
        
        // Hacer logout
        useAuthStore.getState().logout();
        
        // Redirigir a login
        window.location.href = '/login';
        
        return Promise.reject(err);
      }
    }

    // Si es 401 pero no necesita refresh (ya fue intentado), logout
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    // Si el error es 403 (Forbidden - Permisos insuficientes)
    if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
    }

    // Rechazar el error para que se maneje en el componente
    return Promise.reject(error);
  }
);

// ============ FUNCIONES HELPER ============

// GET - Obtener datos
export const get = (endpoint) => api.get(endpoint);

// POST - Crear datos
export const post = (endpoint, data) => api.post(endpoint, data);

// PUT - Actualizar datos
export const put = (endpoint, data) => api.put(endpoint, data);

// PATCH - Actualización parcial
export const patch = (endpoint, data) => api.patch(endpoint, data);

// DELETE - Eliminar datos
export const delete_ = (endpoint) => api.delete(endpoint);

// ============ SERVICIOS ESPECÍFICOS ============

export const authService = {
  login: (email, password) => 
    api.post('/api/Auth/login', { email, password }),
  
  refresh: (refreshToken) => 
    api.post('/api/Auth/refresh', { refreshToken }),
  
  logout: () => 
    api.post('/api/Auth/logout'),
};

export const clienteService = {
  // GET paginado: devuelve { items, pageNumber, pageSize, totalCount, totalPages, hasPreviousPage, hasNextPage }
  getAll: (page = 1, pageSize = 10, buscar = '') =>
    api.get('/api/v1/Cliente', {
      params: { page, pageSize, buscar: buscar || undefined },
    }),

  getById: (id) => api.get(`/api/v1/Cliente/${id}`),

  create: (cliente) => api.post('/api/v1/Cliente', cliente),

  update: (id, cliente) => api.put(`/api/v1/Cliente/${id}`, cliente),

  // Cambiar estado: "Activo" o "Inactivo"
  cambiarEstado: (id, estado) =>
    api.put(`/api/v1/Cliente/${id}/cambio`, { id, estado }),
};

// Exportar la instancia de axios para uso directo si es necesario
export default api;