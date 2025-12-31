import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainStore {
    darkMode: boolean;
    isMobile: boolean;
    currentSection: string;
    toggleDarkMode: () => void;
    getDarkMode: () => boolean;
    getCurrentSection: () => string;
    setCurrentSection: (string: string) => void;
    setIsMobile: (isMobile: boolean) => void;
}

export const useMainStore = create<MainStore>()(
    persist(
        (set, get) => ({
            darkMode: false,
            isMobile: false,
            currentSection: "creative developer",

            toggleDarkMode: () =>
                set((state) => {
                    const next = !state.darkMode;
                    // apply darkmode class to body
                    document.body.classList.toggle("dark", next);
                    return { darkMode: next };
                }),

            getDarkMode: () => get().darkMode,

            setIsMobile: (isMobile: boolean) =>
                set(() => ({
                    isMobile: isMobile
                })),
                
            getCurrentSection: () => get().currentSection,

            setCurrentSection: (section: string) => {
                set(() => ({ currentSection: section }));
            }

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
