export type CameraPosition = readonly [number, number, number];

export interface GalleryCameraConfig {
  desktopPosition: CameraPosition;
  mobilePosition: CameraPosition;
  desktopZoomScale: number;
  mobileZoomScale: number;
  maxDesktopZoom: number;
  maxMobileZoom: number;
}

export const defaultGalleryCamera: GalleryCameraConfig = {
  desktopPosition: [0, 4.7, 12],
  mobilePosition: [0, 3.8, 12],
  desktopZoomScale: 0.11,
  mobileZoomScale: 0.34,
  maxDesktopZoom: 120,
  maxMobileZoom: 126,
};
