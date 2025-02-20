import axios from "axios";
import { auth } from './firebaseConfig';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: false
});

// Simplified request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
