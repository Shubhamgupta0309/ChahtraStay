import axios from "axios";

// Support either VITE_BACKEND_URL (used in some configs) or VITE_API_URL (present in .env)
const baseURL =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL,
  withCredentials: false,
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
