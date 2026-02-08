import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', 
  //baseURL: 'http://34.238.73.57/api/v1/', 
  timeout: 1000000, 
});

// Este interceptor añade automáticamente el token JWT a TODAS las 
// peticiones que hagas con api. Así se evita poner el token manualmente en cada llamada.
api.interceptors.request.use(
  (config) => { // // 1. Recibe la configuración de la petición
    const token = localStorage.getItem('access_token'); // 2. Busca el token
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; //Lo añade al header
    }
    
    return config;
  },
  (error) => Promise.reject(error) // 6. Si hay error, lo manda al store que estoy llamando
);

// Interceptor para manejar respuestas y refrescar token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    //debugger;
    //cuando falla una peticio (401), Axio la guarda en error.response, y la petición original en error.config
    const originalRequest = error.config;

    // Si el error es 401 y no es un retry 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcar la petición como retry para evitar bucles infinitos para volver a intentar el refresh token

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          //Pedimos un nuevo access token usando el refresh token
          const response = await axios.post(
            `${api.defaults.baseURL}token/refresh/`,
            { refresh: refreshToken }
          );

          // Guardamos el nuevo access token en localStorage
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          // Reintentar la petición original con el nuevo token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); //en ese momento se vuelve a ejecutar la petición original, pero con el nuevo token
        } catch (refreshError) {
          // Si falla el refresh, limpio tokens y redirigir al login
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