import { Canvas, useThree } from '@react-three/fiber';
import { Component, useLayoutEffect, type ReactNode } from 'react';
import { OrthographicCamera } from 'three';
import type { CatalogBook } from '../../content/types';
import { Sketchbook3D } from '../book/Sketchbook3D';
import { getBookPosition } from '../gallery/galleryLayout';
import { defaultGalleryCamera, type GalleryCameraConfig } from './galleryCamera';
import { SceneLighting } from './SceneLighting';

interface SketchbookSceneProps {
  books: CatalogBook[];
  columns: number;
  hoveredId: string | null;
  narrow: boolean;
  reducedMotion: boolean;
  cameraConfig?: GalleryCameraConfig;
}

interface SceneErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function CameraRig({ narrow, config }: { narrow: boolean; config: GalleryCameraConfig }) {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    const position = narrow ? config.mobilePosition : config.desktopPosition;
    camera.position.set(...position);
    camera.zoom = narrow
      ? Math.min(config.maxMobileZoom, size.width * config.mobileZoomScale)
      : Math.min(config.maxDesktopZoom, size.width * config.desktopZoomScale);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, config, narrow, size.width]);

  return null;
}

export function SketchbookScene({
  books,
  columns,
  hoveredId,
  narrow,
  reducedMotion,
  cameraConfig = defaultGalleryCamera,
}: SketchbookSceneProps) {
  const rows = Math.ceil(books.length / columns);

  return (
    <SceneErrorBoundary
      fallback={(
        <div
          className="webgl-fallback"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {books.map((book) => (
            <div className="fallback-slot" key={book.id}>
              <div className="fallback-book" style={{ backgroundColor: book.coverColor }}>
                <span />
              </div>
            </div>
          ))}
        </div>
      )}
    >
      <Canvas
        className="gallery-canvas"
        orthographic
        camera={{ position: [0, 4.7, 12], zoom: 110, near: 0.1, far: 50 }}
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <CameraRig narrow={narrow} config={cameraConfig} />
        <SceneLighting />
        {books.map((book, index) => {
          const position = getBookPosition(index, rows, columns);
          return (
            <group key={book.id} position={position}>
              <Sketchbook3D
                coverColor={book.coverColor}
                hovered={hoveredId === book.id}
                reducedMotion={reducedMotion}
              />
            </group>
          );
        })}
      </Canvas>
    </SceneErrorBoundary>
  );
}
