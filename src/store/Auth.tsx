import { create } from "zustand";

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("access_token"), // init token from localStorage

  setToken: (token) => {
    if (token) localStorage.setItem("access_token", token); // save token
    else localStorage.removeItem("access_token"); // remove token if null

    set({ token }); // update state
  },

  logout: () => {
    localStorage.removeItem("access_token"); // clear storage
    set({ token: null }); // reset state
  },
}));