import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginAPI } from "../api/user.api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAPI(username, password);
          set({
            user: response.user || { username },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Login failed",
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const state = get();
        if (state.isAuthenticated && state.user) {
          return true;
        }
        return false;
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
