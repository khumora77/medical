import axios from 'axios';
import type { LoginData, User } from '../types';

const API_BASE_URL = 'https://supercultivated-neumic-rose.ngrok-free.dev';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

export const authApi = {
  login: async (credentials: LoginData): Promise<{ user: User; token: string }> => {
    console.log('API login so\'rovi yuborilmoqda:', credentials);
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('API login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API login xatosi:', error.response?.data || error.message);
      throw error;
    }
  },

  getProfile: async (): Promise<User> => {
    console.log('API profile so\'rovi yuborilmoqda');
    try {
      const token = localStorage.getItem('token');
      console.log('Joriy token:', token);
      
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API profile response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API profile xatosi:', error.response?.data || error.message);
      throw error;
    }
  }
};