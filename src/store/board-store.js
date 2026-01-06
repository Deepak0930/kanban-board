import { create } from "zustand";
import { sleep } from "@/utils/sleep";
import axios from "@/config/axios";

export const useBoardStore = create((set) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get("/tasks");
      set({ tasks: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addTask: async (task) => {
    try {
      set({ isLoading: true });
      const res = await axios.post("/tasks", task);
      set((state) => ({
        tasks: [...state.tasks, res.data],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  moveTask: async (id, stage) => {
    try {
      set({ isLoading: true });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, stage } : t)),
        isLoading: false,
      }));
      await axios.patch(`/tasks/${id}`, { stage });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeTask: async (id) => {
    try {
      set({ isLoading: true });
      await sleep(2000);
      await axios.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (task) => {
    try {
      set({ isLoading: true });
      await sleep(2000);
      const res = await axios.patch(`/tasks/${task.id}`, task);

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? res.data : t)),
        isLoading: false,
      }));
    } catch (error) {
      console.log(error?.message);
      set({ isLoading: false });
      throw new Error(error.message);
    }
  },
}));
