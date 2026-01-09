import { create } from "zustand";

interface CursorStore {
    isDisplayingText: boolean;
    loadingTime: number; // in seconds
    setIsDisplayingText: (bool: boolean) => void;
}

export const useCursorStore = create<CursorStore>()(
    (set) => ({
        isDisplayingText: false,
        loadingTime: 2,
        setIsDisplayingText: (bool) => {
            set({ isDisplayingText: bool });
        },
    }
    )
);
