import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, type Group } from 'three';
import { BookCover } from './BookCover';
import { PageMesh } from './PageMesh';

export interface Sketchbook3DProps {
  coverColor: string;
  hovered?: boolean;
  openingAngle?: number;
  reducedMotion?: boolean;
}

const WIDTH = 1.62;
const HEIGHT = 2.16;

export function Sketchbook3D({
  coverColor,
  hovered = false,
  openingAngle = 0,
  reducedMotion = false,
}: Sketchbook3DProps) {
  const bookRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!bookRef.current) return;
    const hoverEnabled = hovered && !reducedMotion;
    bookRef.current.position.z = MathUtils.damp(bookRef.current.position.z, hoverEnabled ? 0.13 : 0, 7, delta);
    bookRef.current.rotation.z = MathUtils.damp(bookRef.current.rotation.z, hoverEnabled ? -0.025 : 0, 7, delta);
  });

  return (
    <group ref={bookRef} rotation={[-0.13, -0.16, -0.035]}>
      <BookCover color={coverColor} width={WIDTH} height={HEIGHT} position={[0, 0, -0.115]} />

      <RoundedBox args={[WIDTH * 0.94, HEIGHT * 0.955, 0.205]} radius={0.025} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e0d1" roughness={0.98} />
      </RoundedBox>

      <mesh position={[WIDTH * 0.475, 0, 0.005]} castShadow>
        <boxGeometry args={[0.018, HEIGHT * 0.91, 0.18]} />
        <meshStandardMaterial color="#c8bead" roughness={1} />
      </mesh>
      <mesh position={[0, -HEIGHT * 0.48, 0.005]} castShadow>
        <boxGeometry args={[WIDTH * 0.9, 0.018, 0.18]} />
        <meshStandardMaterial color="#d4ccbd" roughness={1} />
      </mesh>

      <group position={[-WIDTH / 2, 0, 0.14]} rotation-y={-openingAngle}>
        <BookCover color={coverColor} width={WIDTH} height={HEIGHT} position={[WIDTH / 2, 0, 0]} />
      </group>

      <RoundedBox args={[0.145, HEIGHT * 1.01, 0.29]} radius={0.04} smoothness={3} position={[-WIDTH / 2 - 0.025, 0, 0]} castShadow>
        <meshStandardMaterial color={coverColor} roughness={0.88} />
      </RoundedBox>

      <PageMesh width={WIDTH * 0.9} height={HEIGHT * 0.92} position={[0.025, 0, 0.096]} />
    </group>
  );
}
