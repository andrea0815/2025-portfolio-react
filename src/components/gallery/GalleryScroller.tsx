import React from 'react';

type GalleryScrollerProps = {
    scrollRef: any;
    displayProjects: any[];
}

function GalleryScroller({ scrollRef, displayProjects }: GalleryScrollerProps) {

    const SCROLL_HEIGHT = displayProjects.length * 100;

    return (
        <div
            className="scroll-container select-auto flex flex-col text-white snap-y snap-mandatory"
            style={{ height: `${SCROLL_HEIGHT}dvh` }}
        >
            {displayProjects.map((_, index) => (
                <div key={index} className="h-dvh snap-start" />
            ))}
        </div>
    );
}

export default GalleryScroller;
