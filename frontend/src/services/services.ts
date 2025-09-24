// src/services/services.ts
import axios from 'axios';

// Ngrok yoki backend linkini shu yerda saqlang
const API_BASE = 'https://supercultivated-neumic-rose.ngrok-free.dev'; 

// Foydalanuvchi qo‘shish funksiyasi
export const createUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const response = await axios.post(`${API_BASE}/users`, userData);
  return response.data;
};
