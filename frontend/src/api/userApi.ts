import axios from 'axios';
import { useAuthStore } from '../store/auth-store';
import type { CreateUserDto, ListUsersDto, UpdateRoleDto, UpdateStatusDto, User, UsersResponse } from '../types/user';

const API_BASE_URL = 'https://supercultivated-neumic-rose.ngrok-free.dev';

// Axios instance yaratish
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Request interceptor - har so'rovdan oldin token ni qo'shish
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 xatolari uchun
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token noto'g'ri yoki muddati o'tgan
      useAuthStore.getState().logout();
      window.location.href = '/login'; // Login sahifasiga yo'naltirish
    }
    return Promise.reject(error);
  }
);

export const userService = {
  // User yaratish
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Userlar ro'yxati
  getUsers: async (params: ListUsersDto): Promise<UsersResponse> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Role yangilash
  updateRole: async (id: string, roleData: UpdateRoleDto): Promise<User> => {
    const response = await api.patch(`/users/${id}/role`, roleData);
    return response.data;
  },

  // Status yangilash
  updateStatus: async (id: string, statusData: UpdateStatusDto): Promise<User> => {
    const response = await api.patch(`/users/${id}/status`, statusData);
    return response.data;
  },

  // User ni ID bo'yicha olish
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};