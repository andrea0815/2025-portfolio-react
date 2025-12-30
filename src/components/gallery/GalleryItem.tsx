import React from 'react';

import type { Project } from "../../stores/useContentful";

type GalleryItemProps = {
    project: any,
}

export function GalleryItem({ project }: GalleryItemProps) {

    const VIDEO_TYPES = ["video/mp4", "video/webm"];

    return (
        <div 
        className="hoverEl gallery-item w-[80dvw] lg:w-[55dvh]  aspect-square flex items-center justify-center snap-end select-auto origin-bottom overflow-hidden">
            {VIDEO_TYPES.includes(project.thumbnail.fields.file.contentType) ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain object-bottom"
                    src={project.thumbnail.fields.file.url}
                />
            ) : (
                <img
                    className="w-full h-full object-contain object-bottom"
                    src={project.thumbnail.fields.file.url}
                    alt={project.thumbnail.fields.title}
                />
            )}
        </div>
    )
}
export default GalleryItem;
