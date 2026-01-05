import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";
import gsap from "gsap";

import type { Tag, Project } from "../../stores/useContentful";

import GalleryItem from "./GalleryItem";

type GalleryHorizontalSliderProps = {
    galleryRef: any,
    displayProjects: Project[],
}

function GalleryHorizontalSlider({ galleryRef, displayProjects }: GalleryHorizontalSliderProps) {

    const location = useLocation();
    const isProjects = location.pathname.startsWith("/projects");
    const isDetailPage = !!useMatch("/projects/:slug");

    // animate on path change
    useEffect(() => {
        const el = galleryRef.current;
        if (!el) return;

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
            className="w-full fixed -z-20 flex top-1/2 -translate-y-1/2 overflow-x-auto items-center no-scrollbar"
        >
            <div className="flex flex-row items-end lg:gap-5 flex-nowrap pl-[80vw] pr-8">
                {displayProjects.map((project) => (
                    <GalleryItem
                        key={(project as any).id ?? project.title} // replace with real stable id
                        project={project}
                    />
                ))}
                <div className="w-[80dvw] lg:w-[65dvh]" />
            </div>
        </div>
    );
}

export default GalleryHorizontalSlider;
