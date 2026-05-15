import axios from 'axios';

// Use relative paths so Nginx can proxy them to the backend
export const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = axios.create({
  baseURL: '', // Empty means use the same origin
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401s globally (e.g., redirect to login)
const handle401 = (error: any) => {
  if (error.response?.status === 401) {
    window.dispatchEvent(new Event('unauthorized'));
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handle401);
authApi.interceptors.response.use((response) => response, handle401);

export default api;
