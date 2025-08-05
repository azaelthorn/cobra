// client/src/state/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,

  initUser: () => {
    const stored = localStorage.getItem('cobraUser');
    if (stored) {
      set({ user: JSON.parse(stored) });
    }
  },

  setUser: (userData) => {
    localStorage.setItem('cobraUser', JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('cobraUser');
    set({ user: null });
  },
}));
