import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";
import gsap from "gsap";

import type { SliderAssetItem } from "./galleryTypes";

import GalleryItem from "./GalleryItem";

type GalleryHorizontalSliderProps = {
    galleryRef: React.RefObject<HTMLDivElement | null>;
    items: SliderAssetItem[];
};

function GalleryHorizontalSlider({ galleryRef, items }: GalleryHorizontalSliderProps) {
    const isProjects = !!useMatch("/projects/*");

    useEffect(() => {
        const el = galleryRef.current;
        if (!el) return;

        gsap.set(el, {opacity: 0});

        gsap.to(el, {
            opacity: isProjects ? 1 : 0,
            duration: 0.6,
            delay: isProjects ? 1 : 0,
            ease: "power2.out",
            pointerEvents: isProjects ? "auto" : "none",
        });
    }, [isProjects]);

    return (
        <div
            ref={galleryRef}
            className="horizontal w-full fixed -z-20 flex top-1/3 md:top-1/2 -translate-y-1/2 overflow-x-auto items-center no-scrollbar"
        >
            <div className="flex flex-row items-end lg:gap-5 flex-nowrap pl-[80vw] pr-8">
                {items.map((item) => (
                    <GalleryItem key={item.id} item={item} />
                ))}
                <div className="w-[80dvw] lg:w-[65dvh]" />
            </div>
        </div>
    );
}


export default GalleryHorizontalSlider;
