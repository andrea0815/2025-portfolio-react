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

        if (isDisplayingText) {
            setTimeout(() => {
                tween.timeScale(0.7).play();      // fades in
            }, 500)
        } else {
            tween.timeScale(1).reverse();   // fades out back to opacity:0
        }
    }, [isDisplayingText]);

    return (
        <p ref={textRef} className="absolute -translate-y-6 text-cursor">
            {cursorText}
        </p>
    );
}

export default CursorText;
