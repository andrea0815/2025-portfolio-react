import { useEffect, useRef } from 'react';

import { useProjectsStore } from "../../stores/useProjects";

import type { Project } from "../../stores/useContentful";

type GalleryItemProps = {
    project: any,
}

export function GalleryItem({ project }: GalleryItemProps) {
    const activeProject: Project | null = useProjectsStore((s) => s.activeProject);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const isVideo = () => {
        const type = project?.thumbnail?.fields?.file?.contentType;
        return type === "video/mp4" || type === "video/webm";
    };

    const isActive = activeProject?.title === project?.title; // adjust id field if needed

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;           // no video rendered
        if (!isVideo()) return;       // safety

        if (isActive) {
            // play can fail on mobile; ignore the promise
            video.play().catch(() => { });
        } else {
            video.pause();
            video.currentTime = 0; // optional: reset when not active
        }
    }, [isActive]); // only depends on active status

    return (
        <div className="hoverEl gallery-item w-[80dvw] lg:w-[clamp(0px,50dvw,70dvh)] aspect-square flex items-center justify-center snap-end select-none origin-bottom overflow-hidden">
            {isVideo() ? (
                <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    draggable={false}
                    className="w-full h-full object-contain object-bottom pointer-events-none"
                    src={project.thumbnail.fields.file.url}
                />
            ) : (
                <img
                    className="w-full h-full object-contain object-bottom"
                    draggable={false}
                    src={project.thumbnail.fields.file.url}
                    alt={project.thumbnail.fields.title}
                />
            )}
        </div>
    );
}

export default GalleryItem;
