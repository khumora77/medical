import { create } from 'zustand';
import { adminApi } from '../api/adminApi';
import type { User } from '../types';

interface AdminState {
  profile: User | null;
  stats: {
    totalUsers: number;
    activeSessions: number;
    tasksCompleted: number;
    storageUsed: string;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<void>;
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  profile: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await adminApi.getProfile();
      set({ profile, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Profil ma\'lumotlarini yuklashda xatolik';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      console.error('Profil yuklashda xatolik:', error);
    }
  },

  updateProfile: async (profileData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await adminApi.updateProfile(profileData);
      set({ profile: updatedProfile, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Profilni yangilashda xatolik';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  updateAvatar: async (avatarFile: File) => {
    set({ isLoading: true, error: null });
    try {
      const { avatarUrl } = await adminApi.updateAvatar(avatarFile);
      const currentProfile = get().profile;
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, avatar: avatarUrl };
        set({ profile: updatedProfile, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Avatar yangilashda xatolik';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await adminApi.changePassword(passwordData);
      set({ isLoading: false });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Parol yangilashda xatolik';
      
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await adminApi.getStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      console.warn('Statistika yuklashda xatolik:', error);
      // Stats olishda xatolik bo'lsa ham, loadingni to'xtatish
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));