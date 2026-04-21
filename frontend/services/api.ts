
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error("Token não encontrado no LocalStorage!");
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;