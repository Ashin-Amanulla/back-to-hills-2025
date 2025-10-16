import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginAPI } from "../api/user.api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAPI(username, password);

          // Store the token in localStorage for axios interceptor
          if (response.token) {
            localStorage.setItem("adminToken", response.token);
          }

          set({
            user: response.user || { username },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Login failed",
          });
          throw error;
        }
      },

      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem("adminToken");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Force logout on auth errors (invalid/expired token)
      forceLogout: () => {
        // Clear token from localStorage
        localStorage.removeItem("adminToken");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please login again.",
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const state = get();
        const storedToken = localStorage.getItem("adminToken");

        if (state.isAuthenticated && state.user && storedToken) {
          return true;
        }
        return false;
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
