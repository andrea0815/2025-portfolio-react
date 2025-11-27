import { create } from "zustand";

type PageTransitionStore = {
    targetRoute: string | null;
    isTransitioning: boolean;

    pendingAnimations: number;
    registerAnimation: () => void;
    finishAnimation: () => void;

    requestTransition: (route: string) => void;
    completeTransition: () => void;

    navigateFn: ((route: string) => void) | null;
    setNavigateFn: (fn: (route: string) => void) => void;
    navigate: (() => void) | null;
};

export const usePageTransition = create<PageTransitionStore>((set, get) => ({
    targetRoute: null,
    isTransitioning: false,

    navigateFn: null,
    setNavigateFn: (fn) => set({ navigateFn: fn }),
    
    navigate: () => {
        const { pendingAnimations, targetRoute, navigateFn } = get();
        if (pendingAnimations === 0 && targetRoute) {
            get().completeTransition();

            if (navigateFn) {
                navigateFn(targetRoute);
            }
        }
    },

    pendingAnimations: 0,
    registerAnimation: () =>
        set((s) => ({ pendingAnimations: s.pendingAnimations + 1 })),

    finishAnimation: () => {
        set((s) => ({ pendingAnimations: s.pendingAnimations - 1 }));

        // if no animations left → complete transition
        const { navigate } = get();
        if (navigate) {
            navigate()
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
