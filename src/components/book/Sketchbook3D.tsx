import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { MathUtils, type Group } from 'three';
import type { PageTurnConfig, PageTurnDirection } from '../../animation/pageAnimations';
import { BookCover } from './BookCover';
import { BOOK_HEIGHT, BOOK_WIDTH, PAGE_HEIGHT, PAGE_WIDTH } from './bookDimensions';
import { PageMesh } from './PageMesh';
import { PageStack } from './PageStack';
import type { SketchbookPage } from './pageTypes';

export interface Sketchbook3DHandle {
  readonly root: Group | null;
  readonly cover: Group | null;
  readonly introPage: Group | null;
}

export interface Sketchbook3DProps {
  coverColor: string;
  currentPageIndex?: number;
  hovered?: boolean;
  onPageTurnComplete?: () => void;
  pages?: SketchbookPage[];
  pageTurnConfig?: PageTurnConfig;
  pageTurnDirection?: PageTurnDirection | null;
  reducedMotion?: boolean;
}

const ignorePageTurnCompletion = () => undefined;

export const Sketchbook3D = forwardRef<Sketchbook3DHandle, Sketchbook3DProps>(function Sketchbook3D(
  {
    coverColor,
    currentPageIndex = 0,
    hovered = false,
    onPageTurnComplete = ignorePageTurnCompletion,
    pages = [],
    pageTurnConfig,
    pageTurnDirection = null,
    reducedMotion = false,
  },
  forwardedRef,
) {
  const rootRef = useRef<Group>(null);
  const coverRef = useRef<Group>(null);
  const introPageRef = useRef<Group>(null);

  useImperativeHandle(forwardedRef, () => ({
    get root() { return rootRef.current; },
    get cover() { return coverRef.current; },
    get introPage() { return introPageRef.current; },
  }), []);

  useFrame((_, delta) => {
    if (!rootRef.current) return;
    const hoverEnabled = hovered && !reducedMotion;
    rootRef.current.position.z = MathUtils.damp(rootRef.current.position.z, hoverEnabled ? 0.13 : 0, 7, delta);
    rootRef.current.rotation.z = MathUtils.damp(rootRef.current.rotation.z, hoverEnabled ? -0.025 : 0, 7, delta);
  });

  return (
    <group ref={rootRef}>
      <BookCover color={coverColor} width={BOOK_WIDTH} height={BOOK_HEIGHT} position={[0, 0, -0.115]} />

      <RoundedBox
        args={[BOOK_WIDTH * 0.94, BOOK_HEIGHT * 0.955, 0.205]}
        radius={0.025}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e8e0d1" roughness={0.98} />
      </RoundedBox>

      <mesh position={[BOOK_WIDTH * 0.475, 0, 0.005]} castShadow>
        <boxGeometry args={[0.018, BOOK_HEIGHT * 0.91, 0.18]} />
        <meshStandardMaterial color="#c8bead" roughness={1} />
      </mesh>
      <mesh position={[0, -BOOK_HEIGHT * 0.48, 0.005]} castShadow>
        <boxGeometry args={[BOOK_WIDTH * 0.9, 0.018, 0.18]} />
        <meshStandardMaterial color="#d4ccbd" roughness={1} />
      </mesh>

      <PageStack
        config={pageTurnConfig}
        currentPageIndex={currentPageIndex}
        direction={pageTurnDirection}
        onTurnComplete={onPageTurnComplete}
        pages={pages}
        reducedMotion={reducedMotion}
      />

      <group ref={introPageRef} position={[-BOOK_WIDTH / 2, 0, 0.126]}>
        <PageMesh width={PAGE_WIDTH} height={PAGE_HEIGHT} position={[BOOK_WIDTH / 2 + 0.025, 0, 0]} />
      </group>

      <group ref={coverRef} position={[-BOOK_WIDTH / 2, 0, 0.14]}>
        <BookCover color={coverColor} width={BOOK_WIDTH} height={BOOK_HEIGHT} position={[BOOK_WIDTH / 2, 0, 0]} />
      </group>

      <RoundedBox
        args={[0.145, BOOK_HEIGHT * 1.01, 0.29]}
        radius={0.04}
        smoothness={3}
        position={[-BOOK_WIDTH / 2 - 0.025, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={coverColor} roughness={0.88} />
      </RoundedBox>
    </group>
  );
});
