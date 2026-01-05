import type { Project } from "../../stores/useContentful";

// If you have a real Contentful Asset type, use it instead of unknown.
export type MediaAsset = unknown;

export type SliderAssetItem = {
  kind: "asset";
  id: string;

  // the media that will be rendered (thumbnail or gallery image/video)
  asset: MediaAsset;

  // metadata so you can link/navigate or show labels
  project: {
    slug: string;
    title: string;
  };

  // helps you style differently if you want
  role: "thumbnail" | "gallery";
};