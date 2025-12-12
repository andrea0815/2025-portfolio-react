import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";

import { usePageTransition } from "../stores/usePageTransition";

import gsap from "gsap";

function PortraitImage() {

    const {
        isTransitioning,
        registerAnimation,
        finishAnimation,
    } = usePageTransition();

    const portraitRef = useRef<HTMLImageElement | null>(null);

    // --- ANIMATION GUARDS ---
    const exitStarted = useRef(false);
    const animationFinished = useRef(false);

    useEffect(() => {
        const el = portraitRef.current;
        if (!el) return;

        const maxX = 20;
        const maxY = 20;

        // QuickTo creates a single tween and just updates the target
        const quickX = gsap.quickTo(el, "x", {
            duration: 0.7,        // more = more drag
            ease: "power3.out",   // smooth, not snappy
        });

        const quickY = gsap.quickTo(el, "y", {
            duration: 0.7,
            ease: "power3.out",
        });

        const move = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;

            const nx = e.clientX / innerWidth;
            const ny = e.clientY / innerHeight;

            const x = (nx - 0.5) * maxX * 2;
            const y = (ny - 0.5) * maxY * 2;

            quickX(x);
            quickY(y);
        };

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);


    useGSAP(() => {
        gsap.from(portraitRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            pointerEvents: "none",
        });
    })

    useEffect(() => {
        if (!isTransitioning || exitStarted.current) return;

        exitStarted.current = true;

        registerAnimation();            // only once

        // fade out portrait
        gsap.to(portraitRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            pointerEvents: "none",
            onComplete: () => {
                if (!exitStarted.current) return;     // ignore initial animation
                if (animationFinished.current) return;
                animationFinished.current = true;
                finishAnimation();                     // call once
            }
        });

    }, [isTransitioning]);

    return (
        <div className="w-full h-full flex justify-center items-center relative overflow-hidden">
            <img
                ref={portraitRef}
                src="./images/portrait.jpg"
                alt="portrait"
                className="w-[70%] relative will-change-transform"
            />
        </div>
    );
}


export default PortraitImage;
