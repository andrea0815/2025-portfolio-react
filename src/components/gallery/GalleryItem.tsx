import { useEffect, useMemo, useRef } from "react";
import { useFilterStore } from "../../stores/useFilter";

import type { Project } from "../../stores/useContentful";
import type { SliderAssetItem } from "./galleryTypes";

// helper types (until you type Contentful asset properly)
type AssetLike = {
  fields?: {
    title?: string;
    file?: {
      url?: string;
      contentType?: string;
    };
  };
};

type GalleryItemProps = {
  item: SliderAssetItem;
};

export function GalleryItem({ item }: GalleryItemProps) {
  const currentProject: Project | null = useFilterStore((s) => s.currentProject);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // item.asset is your media (thumbnail OR gallery asset)
  const asset = item.asset as AssetLike;

  const url = asset.fields?.file?.url ?? "";
  const contentType = asset.fields?.file?.contentType ?? "";
  const alt = asset.fields?.title ?? item.project.title ?? "media";

  const isVideo = useMemo(() => {
    return contentType === "video/mp4" || contentType === "video/webm";
  }, [contentType]);

  // Active if the currently selected project matches the item's project
  const isActive = currentProject?.slug === item.project.slug;
  // (slug is better than title, because titles can repeat)

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!isVideo) return;

    if (isActive) {
      video.play().catch(() => { });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, isVideo]);

  // If there is no URL, don't render broken media
  if (!url) return null;

  return (
    <div className="hoverEl gallery-item w-[80dvw] lg:w-[clamp(0px,50dvw,70dvh)] aspect-square flex items-center justify-center snap-end select-none origin-bottom overflow-hidden">
      {isVideo ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          draggable={false}
          className="w-full h-full object-contain object-bottom pointer-events-none"
          src={url}
        />
      ) : (
        <img
          className="w-full h-full object-contain object-bottom"
          draggable={false}
          src={url}
          alt={alt}
        />
      )}
    </div>
  );
}

export default GalleryItem;
