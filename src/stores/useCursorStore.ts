import { create } from "zustand";

interface CursorStore {
    isDisplayingText: boolean;
    displayText: string;
    loadingTime: number; // in seconds
    setIsDisplayingText: (bool: boolean) => void;
    setDisplayText: (string: string) => void;
}

export const useCursorStore = create<CursorStore>()(
    (set) => ({
        isDisplayingText: true,
        loadingTime: 2,
        displayText: "log",
        setIsDisplayingText: (bool) => {
            set({ isDisplayingText: bool });
        },
        setDisplayText: (string) => {
            set({ displayText: string });
        },
    }
    )
);
