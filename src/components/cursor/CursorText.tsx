import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import { useCursorStore } from "../../stores/useCursorStore";

type CursorTextProps = {
    textRef: React.RefObject<HTMLParagraphElement | null>;
}

function CursorText({ textRef }: CursorTextProps) {

    const isDisplayingText = useCursorStore((s) => s.isDisplayingText);
    const displayText = useCursorStore((s) => s.displayText);

    const textFadeTweenRef = useRef<gsap.core.Tween | null>(null);
    const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cursorText = displayText;

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;

        gsap.set(el, { opacity: 0 });

        textFadeTweenRef.current = gsap.to(el, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
            paused: true,
        });

        return () => {
            textFadeTweenRef.current?.kill();
            textFadeTweenRef.current = null;
        };
    }, []);

    useEffect(() => {
        const tween = textFadeTweenRef.current;
        if (!tween) return;

        // Always cancel any scheduled "show" when state changes
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }

        if (isDisplayingText) {
            showTimeoutRef.current = setTimeout(() => {
                // double-check tween still exists (component could have unmounted / refs changed)
                const t = textFadeTweenRef.current;
                if (!t) return;

                t.timeScale(0.05).play();
            }, 2000);
        } else {
            tween.timeScale(1).reverse();
        }

        // Cleanup on unmount / before next run
        return () => {
            if (showTimeoutRef.current) {
                clearTimeout(showTimeoutRef.current);
                showTimeoutRef.current = null;
            }
        };
    }, [isDisplayingText]);

    return (
        <p ref={textRef} className="absolute -translate-y-6 text-cursor whitespace-nowrap">
            {cursorText}
        </p>
    );
}

export default CursorText;
