import axios from 'axios';
import type { LoginData, User } from '../types';
import { useAuthStore } from '../store/auth-store';

const API_BASE_URL = 'https://supercultivated-neumic-rose.ngrok-free.dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Request interceptor - token ni avtomatik qo'shish
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log('Request interceptor token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginData): Promise<{ user: User; access_token: string }> => {
    console.log('API login so\'rovi yuborilmoqda:', JSON.stringify(credentials, null, 2));
    
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('API login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API login xatosi:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  getProfile: async (): Promise<User> => {
    console.log('API profile so\'rovi yuborilmoqda');
    try {
      const response = await api.get('/auth/me');
      console.log('API profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API profile xatosi:', error.response?.data || error.message);
      throw error;
    }
  }
};