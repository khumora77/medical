import { create } from "zustand";
import { authApi } from "../api/authApi";
import type { LoginData, User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  login: async (credentials: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.login(credentials);

     
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error: any) {
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const user = await authApi.getProfile();
      set({
        user,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      get().logout();
    }
  },

  clearError: () => set({ error: null }),
}));
