import assert from 'node:assert/strict';
import { Texture } from 'three';
import {
  clampPageTurnProgress,
  getPageTurnPlan,
} from '../src/animation/pageAnimations.ts';
import { deformPagePositions } from '../src/components/book/pageDeformation.ts';
import { configurePageTexture } from '../src/components/book/useNearbyPageTextures.ts';

const closeTo = (actual, expected, tolerance = 0.0001) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not close to ${expected}`);
};

assert.equal(clampPageTurnProgress(-1), 0);
assert.equal(clampPageTurnProgress(2), 1);

assert.deepEqual(getPageTurnPlan(3, 0, 'forward'), {
  endProgress: 1,
  startProgress: 0,
  targetPageIndex: 1,
  turningPageIndex: 0,
  underlyingPageIndex: 1,
});
assert.deepEqual(getPageTurnPlan(3, 2, 'backward'), {
  endProgress: 0,
  startProgress: 1,
  targetPageIndex: 1,
  turningPageIndex: 1,
  underlyingPageIndex: 2,
});
assert.equal(getPageTurnPlan(3, 0, 'backward'), null);
assert.equal(getPageTurnPlan(3, 2, 'forward'), null);
assert.equal(getPageTurnPlan(2, 0, 'forward')?.targetPageIndex, 1);
assert.equal(getPageTurnPlan(5, 3, 'backward')?.targetPageIndex, 2);
assert.equal(getPageTurnPlan(1, 0, 'forward'), null);
assert.equal(getPageTurnPlan(0, 0, 'forward'), null);

const width = 2;
const base = new Float32Array([
  0, 0, 0,
  width / 2, 0, 0,
  width, 0, 0,
]);
const output = new Float32Array(base.length);

deformPagePositions(base, output, width, 0);
closeTo(output[6], width);
closeTo(output[8], 0);

deformPagePositions(base, output, width, 0.5);
closeTo(output[0], 0);
closeTo(output[2], 0);
assert.ok(output[8] > width * 0.75, 'the free edge should arc above the book mid-turn');

deformPagePositions(base, output, width, 1);
closeTo(output[6], -width);
closeTo(output[8], 0);

const frontTexture = new Texture();
configurePageTexture(frontTexture, 'front');
assert.equal(frontTexture.repeat.x, 1);

const backTexture = new Texture();
configurePageTexture(backTexture, 'back');
assert.equal(backTexture.repeat.x, -1);
assert.equal(backTexture.offset.x, 1);

console.log('Page turn tests passed: order, bounds, deformation, and texture orientation.');
