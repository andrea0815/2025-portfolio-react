import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { clamp, measureGeometry } from "./galleryGeometry";

type UseGsapScrollGalleryArgs = {
    enabled: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    galleryRef: React.RefObject<HTMLDivElement | null>;
    fokusOffsetRight: number;
    scaleMin: number;
    scaleRange: number;
    opacityMin: number;
    opacityRange: number;
    itemSelector?: string;
    trackSelector?: string;
    onActiveIndex: (index: number) => void;
}

export function useGsapScrollGallery({
    enabled,
    scrollRef,
    galleryRef,
    fokusOffsetRight,
    scaleMin = 0.75,
    scaleRange = 0.25,
    opacityMin = 0.15,
    opacityRange = 0.85,
    itemSelector = ".gallery-item",
    trackSelector = ".flex.flex-row",
    onActiveIndex,
}: UseGsapScrollGalleryArgs) {

    const geometryRef = useRef<{ centers: number[]; widths: number[] }>({
        centers: [],
        widths: [],
    })
    const didInitRef = useRef(false);

    useLayoutEffect(() => {
        didInitRef.current = false;

        const scrollEl = scrollRef.current;
        const galleryEl = galleryRef.current;
        if (!enabled || !scrollEl || !galleryEl) return;

        const track = galleryEl.querySelector(trackSelector) as HTMLDivElement | null;
        const items = Array.from(galleryEl.querySelectorAll<HTMLElement>(itemSelector));
        if (!track || items.length === 0) return;

        const remeasure = () => {
            geometryRef.current = measureGeometry(items);
        }

        remeasure();

        const xTo = gsap.quickTo(track, "x", { duration: 0.25, ease: "power2.out" });

        const apply = () => {
            const vh = scrollEl.clientHeight; // viewport height
            const raw = scrollEl.scrollTop / vh; // raw scroll position in "dvh" units

            const activeIndex = Math.round(raw);
            onActiveIndex(activeIndex);

            const i0 = Math.floor(raw); // current index
            const i1 = Math.min(items.length - 1, i0 + 1); // next index
            const t = raw - i0;

            const { centers, widths } = geometryRef.current;

            const safeI0 = clamp(i0, 0, items.length - 1);
            const c0 = centers[safeI0] ?? 0; // center of current item
            const c1 = centers[i1] ?? c0;
            const activeCenter = c0 + (c1 - c0) * t; // interpolated center

            const firstWidth = widths[0] ?? items[0].offsetWidth;
            const heroX = window.innerWidth - fokusOffsetRight - firstWidth / 2;

            let x = heroX - activeCenter;

            const minX = window.innerWidth - track.scrollWidth;
            x = clamp(x, minX, 0);

            if (!didInitRef.current) {
                gsap.set(track, { x });
                didInitRef.current = true;
            } else {
                xTo(x);
            }

            // per-item scale/opacity
            for (const item of items) {
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.left + rect.width / 2;

                const distance = Math.abs(heroX - itemCenter);
                const maxDistance = window.innerWidth / 3;
                const u = 1 - Math.min(distance / maxDistance, 1);

                gsap.set(item, { scale: scaleMin + scaleRange * u, opacity: opacityMin + opacityRange * u });
            }
        }

        apply();

        const onResize = () => {
            remeasure();
            apply();
        }

        scrollEl.addEventListener("scroll", apply);
        window.addEventListener("resize", onResize);

        return () => {
            scrollEl.removeEventListener("scroll", apply);
            window.removeEventListener("resize", onResize);
        };
    }, [enabled, scrollRef, galleryRef, fokusOffsetRight, scaleMin, scaleRange, opacityMin, opacityRange, itemSelector, trackSelector, onActiveIndex]);
}