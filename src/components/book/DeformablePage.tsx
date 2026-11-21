import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from 'react';
import {
  BackSide,
  FrontSide,
  PlaneGeometry,
  type BufferAttribute,
  type Texture,
} from 'three';
import { deformPagePositions } from './pageDeformation';

export interface DeformablePageHandle {
  setProgress: (progress: number) => void;
}

interface DeformablePageProps {
  backTexture: Texture | null;
  frontTexture: Texture | null;
  height: number;
  initialProgress: number;
  position: [number, number, number];
  segments?: number;
  visible?: boolean;
  width: number;
}

export const DeformablePage = forwardRef<DeformablePageHandle, DeformablePageProps>(function DeformablePage(
  {
    backTexture,
    frontTexture,
    height,
    initialProgress,
    position,
    segments = 28,
    visible = true,
    width,
  },
  forwardedRef,
) {
  const { basePositions, geometry } = useMemo(() => {
    const nextGeometry = new PlaneGeometry(width, height, segments, 4);
    nextGeometry.translate(width / 2, 0, 0);
    const positions = nextGeometry.getAttribute('position') as BufferAttribute;
    return {
      basePositions: new Float32Array(positions.array as ArrayLike<number>),
      geometry: nextGeometry,
    };
  }, [height, segments, width]);

  const setProgress = useCallback((rawProgress: number) => {
    const positions = geometry.getAttribute('position') as BufferAttribute;
    const positionArray = positions.array as Float32Array;
    deformPagePositions(basePositions, positionArray, width, rawProgress);

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [basePositions, geometry, width]);

  useImperativeHandle(forwardedRef, () => ({ setProgress }), [setProgress]);
  useLayoutEffect(() => setProgress(initialProgress), [initialProgress, setProgress]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group position={position} visible={visible}>
      <mesh geometry={geometry} castShadow receiveShadow frustumCulled={false} renderOrder={8}>
        <meshStandardMaterial
          color={frontTexture ? '#ffffff' : '#f3eee2'}
          map={frontTexture ?? undefined}
          roughness={0.92}
          side={FrontSide}
        />
      </mesh>
      <mesh geometry={geometry} castShadow receiveShadow frustumCulled={false} renderOrder={8}>
        <meshStandardMaterial
          color={backTexture ? '#ffffff' : '#ede6d8'}
          map={backTexture ?? undefined}
          roughness={0.94}
          side={BackSide}
        />
      </mesh>
    </group>
  );
});
