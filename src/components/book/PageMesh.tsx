import { DoubleSide, type Texture } from 'three';
import type { ThreeElements } from '@react-three/fiber';

type PageMeshProps = ThreeElements['mesh'] & {
  width: number;
  height: number;
  color?: string;
  map?: Texture | null;
  segments?: number;
};

export function PageMesh({ width, height, color = '#f3eee2', map, segments = 16, ...meshProps }: PageMeshProps) {
  return (
    <mesh castShadow receiveShadow {...meshProps}>
      <planeGeometry args={[width, height, segments, 1]} />
      <meshStandardMaterial color={map ? '#ffffff' : color} map={map ?? undefined} roughness={0.94} side={DoubleSide} />
    </mesh>
  );
}
