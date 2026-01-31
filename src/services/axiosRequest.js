import axios from 'axios';

// Función auxiliar para leer cookies nativamente
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  //baseURL: 'http://localhost:8000/api/v1/', 
  baseURL: 'http://34.238.73.57/api/v1/', 
  timeout: 1000000, 
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    // Usamos la función manual
    const token = getCookie('csrftoken');
    
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;