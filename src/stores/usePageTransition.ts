import { create } from "zustand";

type PageTransitionStore = {
    targetRoute: string | null;
    isTransitioning: boolean;

    pendingAnimations: number;
    registerAnimation: () => void;
    finishAnimation: () => void;

    requestTransition: (route: string) => void;
    completeTransition: () => void;
};

export const usePageTransition = create<PageTransitionStore>((set, get) => ({
    targetRoute: null,
    isTransitioning: false,

    pendingAnimations: 0,
    registerAnimation: () =>
        set((s) => ({ pendingAnimations: s.pendingAnimations + 1 })),

    finishAnimation: () => {
        set((s) => ({ pendingAnimations: s.pendingAnimations - 1 }));

        // if no animations left → complete transition
        const { pendingAnimations, targetRoute } = get();
        if (pendingAnimations === 0 && targetRoute) {
            
            get().completeTransition();
        }
    },

    requestTransition: (route) =>
        set({
            targetRoute: route,
            isTransitioning: true,
            pendingAnimations: 0
        }),

    completeTransition: () =>
        set({
            isTransitioning: false,
        }),
}));
