import { clampPageTurnProgress } from '../../animation/pageAnimations';

export function deformPagePositions(
  basePositions: ArrayLike<number>,
  outputPositions: Float32Array,
  width: number,
  rawProgress: number,
) {
  const progress = clampPageTurnProgress(rawProgress);
  const turnAngle = -Math.PI * progress;
  const motionArc = Math.sin(Math.PI * progress);

  for (let index = 0; index < outputPositions.length; index += 3) {
    const baseX = basePositions[index];
    const baseY = basePositions[index + 1];
    const normalizedX = Math.min(1, Math.max(0, baseX / width));

    // The outer edge trails the spine slightly. Its higher-order term gives the
    // free edge a visible curl without requiring a physics solver.
    const outerEdgeLag = motionArc * 0.58 * Math.pow(normalizedX, 1.35);
    const vertexAngle = turnAngle + outerEdgeLag;
    const spineArch = motionArc * 0.1 * Math.sin(Math.PI * normalizedX);
    const outerEdgeCurl = motionArc * 0.1 * Math.pow(normalizedX, 4);

    outputPositions[index] = baseX * Math.cos(vertexAngle);
    outputPositions[index + 1] = baseY
      + motionArc * 0.012 * Math.sin(normalizedX * Math.PI * 2);
    outputPositions[index + 2] = -baseX * Math.sin(vertexAngle)
      + spineArch
      + outerEdgeCurl;
  }
}
