import { create } from "zustand";

type AppState = {
  hasInitialized: boolean,
  setInitialized: () => void
};

export const useAppState = create<AppState>((set) => ({
    hasInitialized: false,
    setInitialized: () => set({ hasInitialized: true })
}));