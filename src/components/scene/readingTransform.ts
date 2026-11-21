import { Euler, OrthographicCamera, Vector3 } from 'three';
import {
  calculateLeftPageOffset,
  calculateReadingScale,
  type BookTransitionConfig,
} from '../../animation/bookTransitions';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../book/bookDimensions';
import type { GalleryCameraConfig } from './galleryCamera';

interface ReadingTransformInput {
  camera: OrthographicCamera;
  cameraConfig: GalleryCameraConfig;
  transitionConfig: BookTransitionConfig;
  viewportHeight: number;
  viewportWidth: number;
}

export function calculateReadingTransform({
  camera,
  cameraConfig,
  transitionConfig,
  viewportHeight,
  viewportWidth,
}: ReadingTransformInput) {
  const narrow = viewportWidth < 700;
  const finalZoom = narrow
    ? Math.min(cameraConfig.maxMobileZoom, viewportWidth * cameraConfig.mobileZoomScale)
    : Math.min(cameraConfig.maxDesktopZoom, viewportWidth * cameraConfig.desktopZoomScale);
  const visibleWidth = viewportWidth / finalZoom;
  const visibleHeight = viewportHeight / finalZoom;
  const scale = calculateReadingScale(
    visibleWidth,
    visibleHeight,
    PAGE_WIDTH,
    PAGE_HEIGHT,
    transitionConfig,
  );

  camera.updateMatrixWorld();
  const cameraDirection = new Vector3();
  camera.getWorldDirection(cameraDirection);
  const distanceToReadingPlane = (transitionConfig.approachDepth - camera.position.z) / cameraDirection.z;
  const position = camera.position.clone().addScaledVector(cameraDirection, distanceToReadingPlane);
  const rotation = new Euler().setFromQuaternion(camera.quaternion, 'XYZ');

  return {
    leftPageOffset: calculateLeftPageOffset(visibleWidth, scale),
    position,
    rotation,
    scale,
    visibleHeight,
    visibleWidth,
    zoom: finalZoom,
  };
}
