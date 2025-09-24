// src/store/adminStore.ts
import { create } from 'zustand';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AdminStore {
  isLoading: boolean;
  error: string | null;

  changePassword: (payload: ChangePasswordPayload) => Promise<{ message: string }>;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isLoading: false,
  error: null,

  changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
    set({ isLoading: true, error: null });

    try {
      // 💡 Bu yerda API chaqiruvini joylashtiring
      // Masalan: const response = await axios.post('/api/change-password', { ... });
      
      console.log('Parol o‘zgartirish so‘rovi yuborildi:', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Soxta natija (real API o‘rniga)
      await new Promise((res) => setTimeout(res, 1500));

      set({ isLoading: false });
      return { message: 'Parol muvaffaqiyatli yangilandi' };
    } catch (err) {
      set({ isLoading: false, error: 'Parolni yangilashda xatolik yuz berdi' });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
