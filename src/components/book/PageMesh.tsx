import { DoubleSide } from 'three';
import type { ThreeElements } from '@react-three/fiber';

type PageMeshProps = ThreeElements['mesh'] & {
  width: number;
  height: number;
  color?: string;
  segments?: number;
};

export function PageMesh({ width, height, color = '#f3eee2', segments = 16, ...meshProps }: PageMeshProps) {
  return (
    <mesh castShadow receiveShadow {...meshProps}>
      <planeGeometry args={[width, height, segments, 1]} />
      <meshStandardMaterial color={color} roughness={0.94} side={DoubleSide} />
    </mesh>
  );
}
