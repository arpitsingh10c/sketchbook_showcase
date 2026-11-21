import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import type { CatalogBook } from '../types';

interface Props {
  books: CatalogBook[];
  onSelect: (slug: string) => void;
}

function Book({ book, x, y, onSelect }: { book: CatalogBook; x: number; y: number; onSelect: () => void }) {
  return (
    <group position={[x, y, 0]} rotation={[-0.17, -0.16, -0.04]}>
      {/* Starter geometry only: replace with reusable book + deformable pages. */}
      <mesh castShadow position={[0, 0, -0.04]}>
        <boxGeometry args={[1.62, 2.12, 0.25]} />
        <meshStandardMaterial color="#eee7d9" roughness={0.94} />
      </mesh>
      <mesh castShadow position={[-0.02, 0, 0.11]}>
        <boxGeometry args={[1.64, 2.14, 0.10]} />
        <meshStandardMaterial color={book.coverColor} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[-0.83, 0, 0.055]}>
        <boxGeometry args={[0.13, 2.15, 0.27]} />
        <meshStandardMaterial color={book.coverColor} roughness={0.95} />
      </mesh>
      <Html position={[0, 0, 0.23]} center distanceFactor={9}>
        <button className="canvas-book-target" onClick={onSelect} aria-label={`Open ${book.title}`}>
          <span>OPEN BOOK ↗</span>
        </button>
      </Html>
    </group>
  );
}

export function GalleryCanvas({ books, onSelect }: Props) {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const columns = narrow ? 1 : 2;
  const spacingY = 3.35;
  const rows = Math.ceil(books.length / columns);
  const sceneHeight = Math.max(560, rows * (narrow ? 350 : 345));

  return (
    <div className="canvas-stage" style={{ height: sceneHeight }}>
      <Canvas
        orthographic
        camera={{ position: [0, 5.7, 12], zoom: narrow ? 106 : 108, near: 0.01, far: 100 }}
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 8, 7]} intensity={2.2} castShadow />
        {books.map((book, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          const x = columns === 1 ? 0 : col === 0 ? -2.05 : 2.05;
          const y = ((rows - 1) / 2 - row) * spacingY;
          return <Book key={book.id} book={book} x={x} y={y} onSelect={() => onSelect(book.slug)} />;
        })}
      </Canvas>
      <div className="gallery-caption-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {books.map((book) => (
          <button className="gallery-caption" onClick={() => onSelect(book.slug)} key={book.id}>
            <span className="caption-count">COLLECTION · {book.sketchCount} SKETCHES</span>
            <strong>{book.title}</strong>
            <span>{book.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
