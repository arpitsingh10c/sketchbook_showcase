import type { PropsWithChildren } from 'react';

interface PageTurnProps extends PropsWithChildren {
  progress?: number;
  width: number;
}

// This hinge is scene scaffolding only. Milestone 3 replaces it with segmented curl deformation.
export function PageTurn({ progress = 0, width, children }: PageTurnProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return (
    <group rotation-y={-Math.PI * clampedProgress}>
      <group position={[width / 2, 0, 0]}>{children}</group>
    </group>
  );
}
