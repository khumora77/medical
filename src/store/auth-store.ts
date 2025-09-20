import { create } from "zustand";

type AuthState = {
  user: null | { email: string; role: string };
  setAuth: (user: { email: string; role: string } | null) => void;
};

export const useAuthState = create<AuthState>((set) => ({
  user: null,
  setAuth: (user) => set({ user }),
}));
