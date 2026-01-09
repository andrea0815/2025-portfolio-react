import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

import { useCursorStore } from "../../stores/useCursorStore";

type RequestTransition = (route: string) => void;

type UseCursorUpdatesArgs = {
    /** Whether we are on the landing page (press-to-enter should work only there) */
    isLanding: boolean;
    /** Zustand action that triggers your transition */
    requestTransition: RequestTransition;
    /** CSS selector for elements that should grow/shrink cursor on hover */
    hoverSelector?: string;
    /** Where to navigate when hold completes */
    targetRoute?: string;
};

type UseCursorUpdatesReturn = {
    isTouch: boolean;
    cursorRef: React.RefObject<HTMLDivElement | null>;
    loaderRef: React.RefObject<HTMLDivElement | null>;
};

export const useCursorUpdates = ({
    isLanding,
    requestTransition,
    hoverSelector = ".hoverEl",
    targetRoute = "/projects",
}: UseCursorUpdatesArgs): UseCursorUpdatesReturn => {

    const loadingTime = useCursorStore((s) => s.loadingTime);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Keep latest isLanding without re-registering document listeners every route change.
    const isLandingRef = useRef<boolean>(isLanding);
    useEffect(() => {
        isLandingRef.current = isLanding;
    }, [isLanding]);

    const releasedRef = useRef<boolean>(false);

    // SSR-safe + stable for the lifetime of the component
    const isTouch = useMemo(() => {
        if (typeof window === "undefined") return true; // assume touch on server
        return window.matchMedia("(pointer: coarse)").matches;
    }, []);

    useEffect(() => {
        if (isTouch) return;

        const cursor = cursorRef.current;
        // const ring = ringRef.current;
        if (!cursor) return;

        // Quick setters are very fast; perfect for per-mousemove updates.
        const setX = gsap.quickSetter(cursor, "x", "px");
        const setY = gsap.quickSetter(cursor, "y", "px");

        const move = (e: MouseEvent) => {
            setX(e.clientX);
            setY(e.clientY);
        };

        const grow = () => {
            gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power3.out" });
        };

        const shrink = () => {
            gsap.to(cursor, { scale: 0.25, duration: 0.25, ease: "power3.out" });
        };

        // Define handleUp first, so press tween can call it.
        const handleUp = () => {
            releasedRef.current = true;
            //   gsap.to(ring, { opacity: 0, duration: 0.5, ease: "power2.out" });
            loadingBarTween.timeScale(3).reverse();
            cursorGrowTween.timeScale(3).reverse();
        };

        const handleDown = () => {
            if (!isLandingRef.current) return;
            releasedRef.current = false;

            //   gsap.to(ring, { opacity: 0.4, duration: 0.2, ease: "power1.out" });
            loadingBarTween.timeScale(1).play();
            cursorGrowTween.timeScale(1).play();
        };

        const loadingBarTween = gsap.to(loaderRef.current, {
            scaleX: 1,
            opacity: 1,
            duration: loadingTime,
            ease: "power1.out",
            paused: true,
            onComplete: () => {
                // Navigate only if still holding
                if (!releasedRef.current) {
                    requestTransition(targetRoute);
                    // handleUp();
                }
            },
        });

        const cursorGrowTween = gsap.to(cursorRef.current, {
            scale: 1,
            duration: loadingTime,
            ease: "power1.out",
            paused: true,
        });

        // Hover elements wiring + dynamic updates via MutationObserver
        const attachHoverListeners = (nodes: NodeListOf<Element>) => {
            nodes.forEach((el) => {
                el.addEventListener("mouseenter", grow);
                el.addEventListener("mouseleave", shrink);
            });
        };

        const detachHoverListeners = (nodes: NodeListOf<Element>) => {
            nodes.forEach((el) => {
                el.removeEventListener("mouseenter", grow);
                el.removeEventListener("mouseleave", shrink);
            });
        };

        let hoverEls = document.querySelectorAll(hoverSelector);
        attachHoverListeners(hoverEls);

        const observer = new MutationObserver(() => {
            const newEls = document.querySelectorAll(hoverSelector);

            // Remove from old ones, then add to new ones
            detachHoverListeners(hoverEls);
            attachHoverListeners(newEls);

            hoverEls = newEls;
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Document listeners
        document.addEventListener("mousemove", move);
        document.addEventListener("mousedown", handleDown);
        document.addEventListener("mouseup", handleUp);

        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mousedown", handleDown);
            document.removeEventListener("mouseup", handleUp);

            detachHoverListeners(hoverEls);
            observer.disconnect();

            loadingBarTween.kill();
            cursorGrowTween.kill();
        };
    }, [isTouch, hoverSelector, requestTransition, targetRoute]);

    return { isTouch, cursorRef, loaderRef };
};
