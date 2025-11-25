import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SectionStore {
    currentSection: string;
    getCurrentSection: () => string;
    setCurrentSection: (string: string) => void;
}

export const useSectionStore = create<SectionStore>()(
    persist(
        (set, get) => ({
            currentSection: "creative developer",
            getCurrentSection: () => get().currentSection,

            setCurrentSection: (section: string) => {
                set(() => ({ currentSection: section }));
            }

        }),
        {
            name: "section-store"
        }
    )
);
