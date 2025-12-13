// src/axios.js
import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', // Cambia por la URL de tu API
  timeout: 5000, // Opcional: tiempo máximo de espera
  withCredentials: true, // Muy importante: permite enviar cookies
});



export default api;