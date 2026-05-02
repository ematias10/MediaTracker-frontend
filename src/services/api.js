import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes (ej: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 y no hemos intentado reintentar, podríamos refrescar el token aquí.
    // Para simplificar el Sprint 1, solo devolvemos el error, y el Store lo maneja haciendo logout si falla.
    if (error.response?.status === 401) {
      // Opcional: Implementar lógica de refresh token automáticamente aquí.
    }
    
    return Promise.reject(error);
  }
);

export default api;
