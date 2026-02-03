import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', 
  //baseURL: 'http://34.238.73.57/api/v1/', 
  timeout: 1000000, 
});

// Interceptor para añadir el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y refrescar token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${api.defaults.baseURL}token/refresh/`,
            { refresh: refreshToken }
          );

          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          // Reintentar la petición original con el nuevo token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, limpiar tokens y redirigir al login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;