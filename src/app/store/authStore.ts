import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { phone: string; countryCode: string } | null;
  login: (user: { phone: string; countryCode: string }) => void;
  logout: () => void;
}

const getInitialAuthState = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }
  
  try {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const user = JSON.parse(authData);
      return { isAuthenticated: true, user };
    }
  } catch (error) {
    console.error("Error reading auth from localStorage:", error);
    localStorage.removeItem("auth");
  }
  
  return { isAuthenticated: false, user: null };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = getInitialAuthState();
  
  return {
    ...initialState,
    login: (user) => {
      console.log("Login called with:", user);
      localStorage.setItem("auth", JSON.stringify(user));
      set({ isAuthenticated: true, user });
    },
    logout: () => {
      console.log("Logout called");
      localStorage.removeItem("auth");
      set({ isAuthenticated: false, user: null });
    },
  };
});
