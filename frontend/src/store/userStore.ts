import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type{ User, CreateUserDto, UpdateRoleDto, UpdateStatusDto, ListUsersDto, UserState } from '../types/user';
import { userService } from '../api/userApi';

interface UserStore extends UserState {
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ListUsersDto) => void;
  
  // Async actions
  fetchUsers: (params?: ListUsersDto) => Promise<void>;
  createUser: (userData: CreateUserDto) => Promise<boolean>;
  updateUserRole: (id: string, roleData: UpdateRoleDto) => Promise<boolean>;
  updateUserStatus: (id: string, statusData: UpdateStatusDto) => Promise<boolean>;
  fetchUserById: (id: string) => Promise<User | null>;
  reset: () => void;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  },
  filters: {
    page: 1,
    limit: 10
  }
};

export const useUserStore = create<UserStore>()(
  devtools((set, get) => ({
    ...initialState,

    setLoading: (loading: boolean) => {
      set({ loading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    setFilters: (filters: ListUsersDto) => {
      set({ filters: { ...get().filters, ...filters } });
    },

    fetchUsers: async (params?: ListUsersDto) => {
      const { filters } = get();
      const queryParams = { ...filters, ...params };
      
      set({ loading: true, error: null });
      
      try {
        const response = await userService.getUsers(queryParams);
        set({
          users: response.users,
          pagination: {
            current: response.page,
            pageSize: response.limit,
            total: response.total
          },
          filters: queryParams
        });
      } catch (error: any) {
        set({ 
          error: error.response?.data?.message || 'Foydalanuvchilarni yuklashda xatolik' 
        });
        
        // Agar 401 xatosi bo'lsa, login sahifasiga yo'naltiramiz
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        set({ loading: false });
      }
    },

    // ... qolgan funksiyalar o'zgarmaydi
    createUser: async (userData: CreateUserDto): Promise<boolean> => {
      set({ loading: true, error: null });
      
      try {
        const newUser = await userService.createUser(userData);
        set(state => ({
          users: [newUser, ...state.users],
          currentUser: newUser
        }));
        return true;
      } catch (error: any) {
        set({ 
          error: error.response?.data?.message || 'User yaratishda xatolik' 
        });
        
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        return false;
      } finally {
        set({ loading: false });
      }
    },

    // ... boshqa funksiyalar ham shu tartibda
  }), {
    name: 'user-store'
  })
);