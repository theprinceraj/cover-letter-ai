import { useCallback, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  exhaustedUses: number;
  useLimit: number;
  provider: string;
  lastLogin: Date[];
}

export interface Guest {
  id: string;
  ipAddress: string;
  exhaustedUses: number;
  useLimit: number;
}

export interface AuthState {
  user: User | null;
  guest: Guest | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    guest: null,
    token: localStorage.getItem("auth_token") || null,
    isLoading: false,
    isAuthenticated: false,
    isGuest: false,
  });

  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
    setAuthState((prev) => ({ ...prev, token }));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await api.post("/auth/login/local", {
          email,
          password,
        });

        const { access_token } = response.data;
        setToken(access_token);

        // Fetch user data
        const userResponse = await api.get("/auth/me");
        const userData = userResponse.data;

        setAuthState((prev) => ({
          ...prev,
          user: userData.type === "guest" ? null : userData,
          guest: userData.type === "guest" ? userData : null,
          isAuthenticated: true,
          isGuest: userData.type === "guest",
          isLoading: false,
        }));
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Login failed");
        }
        throw error;
      }
    },
    [setToken]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        await api.post("/auth/signup/local", {
          email,
          password,
        });

        // After successful signup, login the user
        await login(email, password);
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Signup failed");
        }
        throw error;
      }
    },
    [login]
  );

  const loginGuest = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await api.post("/auth/login/guest");
      const { access_token, guest } = response.data;

      setToken(access_token);

      setAuthState((prev) => ({
        ...prev,
        user: null,
        guest,
        isAuthenticated: true,
        isGuest: true,
        isLoading: false,
      }));
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Guest login failed");
      }
      throw error;
    }
  }, [setToken]);

  const logout = useCallback(() => {
    setToken(null);
    setAuthState({
      user: null,
      guest: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
    });
  }, [setToken]);

  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await api.get("/auth/me");
      const userData = response.data;

      setAuthState((prev) => ({
        ...prev,
        user: userData.type === "guest" ? null : userData,
        guest: userData.type === "guest" ? userData : null,
        isAuthenticated: true,
        isGuest: userData.type === "guest",
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error refreshing auth:", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return {
    ...authState,
    login,
    signup,
    loginGuest,
    logout,
    refreshAuth,
  };
};
