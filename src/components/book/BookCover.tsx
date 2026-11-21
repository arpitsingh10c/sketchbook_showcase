import { RoundedBox } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';

interface BookCoverProps extends Omit<ThreeElements['group'], 'color'> {
  color: string;
  width: number;
  height: number;
  thickness?: number;
}

export function BookCover({ color, width, height, thickness = 0.085, ...groupProps }: BookCoverProps) {
  return (
    <group {...groupProps}>
      <RoundedBox args={[width, height, thickness]} radius={0.035} smoothness={3} castShadow>
        <meshStandardMaterial color={color} roughness={0.78} metalness={0.02} />
      </RoundedBox>
      <mesh position={[0, 0, thickness / 2 + 0.002]}>
        <planeGeometry args={[width * 0.74, height * 0.76]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.025} roughness={1} />
      </mesh>
    </group>
  );
}
