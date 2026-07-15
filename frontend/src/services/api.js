import axios from 'axios';

const api = axios.create({
  baseURL: 'https://planner-backend-a1ia.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;