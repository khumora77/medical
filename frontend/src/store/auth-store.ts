import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/authApi";
import type { LoginData, User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginData) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginData) => {
        console.log('Login boshlandi:', credentials);
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(credentials);
          console.log('Login response:', response);
          
          const { user, token } = response;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log('Login muvaffaqiyatli. User:', user);
          return user;
        } catch (error: any) {
          console.error('Login xatosi:', error);
          
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Login failed. Please try again.";

          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        console.log('Logout qilindi');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        console.log('checkAuth ishga tushdi');
        const { token } = get();
        
        if (!token) {
          console.log('Token yoq, authenticated false');
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authApi.getProfile();
          console.log('Profile muvaffaqiyatli yuklandi:', user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Profile yuklash xatosi:', error);
          set({ 
            isLoading: false,
            isAuthenticated: false 
          });
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);