import { create } from "zustand";

interface CursorStore {
    darkMode: boolean;
    currentSection: string;
    toggleDarkMode: () => void;
    getDarkMode: () => boolean;
    getCurrentSection: () => string;
    setCurrentSection: (string: string) => void;
}

export const useCursorStore = create<CursorStore>()(
    
        (set, get) => ({
            darkMode: false,
            currentSection: "creative developer",
            toggleDarkMode: () =>
                set((state) => {
                    const next = !state.darkMode;
                    // apply darkmode class to body
                    document.body.classList.toggle("dark", next);
                    return { darkMode: next };
                }),
            getDarkMode: () => get().darkMode,
            getCurrentSection: () => get().currentSection,

            setCurrentSection: (section: string) => {
                set(() => ({ currentSection: section }));
            }

        }
    )
);
