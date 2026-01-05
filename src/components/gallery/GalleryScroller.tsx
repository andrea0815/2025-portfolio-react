import React from 'react';

type GalleryScrollerProps = {
    scrollRef: any;
    displayProjectsCount: number;
}

function GalleryScroller({ scrollRef, displayProjectsCount }: GalleryScrollerProps) {

    const SCROLL_HEIGHT = displayProjectsCount * 100;

    return (
        <div
            className="scroll-container select-auto flex flex-col text-white snap-y snap-mandatory"
            style={{ height: `${SCROLL_HEIGHT}dvh` }}
        >
            {Array.from({ length: displayProjectsCount }, (_, index) => (
                <div key={index} className="h-dvh snap-start" />
            ))}
        </div>
    );
}

export default GalleryScroller;
