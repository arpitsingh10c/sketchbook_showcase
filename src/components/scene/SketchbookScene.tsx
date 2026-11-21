import { Canvas, useThree } from '@react-three/fiber';
import { Component, useLayoutEffect, type ReactNode } from 'react';
import { OrthographicCamera } from 'three';
import type { CatalogBook } from '../../content/types';
import { Sketchbook3D } from '../book/Sketchbook3D';
import { SceneLighting } from './SceneLighting';

interface SketchbookSceneProps {
  books: CatalogBook[];
  columns: number;
  hoveredId: string | null;
  narrow: boolean;
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

function CameraRig({ narrow }: { narrow: boolean }) {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.position.set(0, narrow ? 3.8 : 4.7, 12);
    camera.zoom = narrow ? Math.min(126, size.width * 0.34) : Math.min(120, size.width * 0.11);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, narrow, size.width]);

  return null;
}

export function SketchbookScene({ books, columns, hoveredId, narrow }: SketchbookSceneProps) {
  const rows = Math.ceil(books.length / columns);
  const spacingX = 4.05;
  const spacingY = 3.35;

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
        <CameraRig narrow={narrow} />
        <SceneLighting />
        {books.map((book, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const x = (column - (columns - 1) / 2) * spacingX;
          const y = ((rows - 1) / 2 - row) * spacingY;
          return (
            <group key={book.id} position={[x, y, 0]}>
              <Sketchbook3D coverColor={book.coverColor} hovered={hoveredId === book.id} />
            </group>
          );
        })}
      </Canvas>
    </SceneErrorBoundary>
  );
}
