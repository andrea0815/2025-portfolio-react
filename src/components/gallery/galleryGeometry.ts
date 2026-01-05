export type GalleryGeometry = {
  centers: number[];
  widths: number[];
};

/**
 * Measure each item center *in track coordinates*.
 * We use offsetLeft + width/2 because track x is applied to the whole track.
 */
export function measureGeometry(items: HTMLElement[]): GalleryGeometry {
  const centers = items.map((el) => el.offsetLeft + el.offsetWidth / 2);
  const widths = items.map((el) => el.offsetWidth);
  return { centers, widths };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}