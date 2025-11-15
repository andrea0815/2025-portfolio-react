import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainStore {
    darkMode: boolean;
    toggleDarkMode: () => void;
    getDarkMode: () => boolean;
}

export const useMainStore = create<MainStore>()(
    persist(
        (set, get) => ({
            darkMode: false,
            toggleDarkMode: () =>
                set((state) => {
                    const next = !state.darkMode;
                    // apply darkmode class to body
                    document.body.classList.toggle("dark", next);
                    return { darkMode: next };
                }),
            getDarkMode: () => get().darkMode,

        }),
        {
            name: "main-store",
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.body.classList.toggle("dark", state.darkMode);
                }
            },
        }
    )
);
