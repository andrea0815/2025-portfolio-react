import React from 'react';

import type { Project } from "../../stores/useContentful";

type GalleryItemProps = {
    project: any
}

export function GalleryItem({ project }: GalleryItemProps) {
    return (
        <div className="hoverEl gallery-item w-[65dvh] flex items-center justify-center snap-end select-auto origin-bottom">
            {project.thumbnail.fields.file.contentType === "video/mp4" ? (
                <video
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    src={project.thumbnail.fields.file.url}
                />
            ) : (
                <img
                    className="w-full h-full object-cover"
                    src={project.thumbnail.fields.file.url}
                    alt={project.thumbnail.fields.title}
                />
            )}
        </div>
    )
}
export default GalleryItem;
