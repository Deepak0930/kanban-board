import { create } from "zustand";
import axios from "@/config/axios-server";

export const useAuthStore = create((set) => ({
  user: null,

  login: async (identifier, password) => {
    const payload = { identifier, password };
    const response = await axios.post(`/api/auth/login`, payload);

    if (response.data?.success) {
      set({ user: response.data.user });
      return response.data.user;
    }
  },

  syncUser: async () => {
    const response = await axios.get(`/api/auth/me`);

    if (response.data?.user) {
      set({ user: response.data.user });
    }
  },

  logout: async () => {
    await axios.post(`/api/auth/logout`);
    set({ user: null });
  },
}));
