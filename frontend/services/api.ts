
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  console.log("DEBUG: Todas as chaves do localStorage:", Object.keys(localStorage));
  
  const token = localStorage.getItem('access_token');
  console.log("DEBUG: Token lido diretamente:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error("DEBUG: Token não encontrado no LocalStorage!");
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;