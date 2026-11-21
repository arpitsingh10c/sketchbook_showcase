import { useEffect, useRef, useState } from 'react';
import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from 'three';
import type { SketchbookPage } from './pageTypes';

export interface PageTexturePair {
  back: Texture | null;
  front: Texture | null;
}

export function configurePageTexture(texture: Texture, side: 'front' | 'back') {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  if (side === 'back') {
    // BackSide reverses the UV winding. Flip U once so notes/art stay readable.
    texture.wrapS = RepeatWrapping;
    texture.repeat.x = -1;
    texture.offset.x = 1;
  }
  texture.needsUpdate = true;
}

function resolveAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

function textureKey(side: 'front' | 'back', page: SketchbookPage) {
  const path = side === 'front' ? page.frontImage : (page.backImage ?? page.frontImage);
  return `${side}:${path}`;
}

export function useNearbyPageTextures(pages: SketchbookPage[], currentIndex: number) {
  const cacheRef = useRef(new Map<string, Texture>());
  const pendingRef = useRef(new Map<string, number>());
  const desiredKeysRef = useRef(new Set<string>());
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const nearbyPages = [currentIndex - 1, currentIndex, currentIndex + 1]
      .filter((index) => index >= 0 && index < pages.length)
      .map((index) => pages[index]);
    const desiredKeys = new Set<string>();

    for (const page of nearbyPages) {
      desiredKeys.add(textureKey('front', page));
      desiredKeys.add(textureKey('back', page));
    }
    desiredKeysRef.current = desiredKeys;

    for (const [key, texture] of cacheRef.current) {
      if (!desiredKeys.has(key)) {
        texture.dispose();
        cacheRef.current.delete(key);
      }
    }

    const loader = new TextureLoader();
    for (const page of nearbyPages) {
      for (const side of ['front', 'back'] as const) {
        const key = textureKey(side, page);
        if (cacheRef.current.has(key) || pendingRef.current.has(key)) continue;
        const requestId = ++requestIdRef.current;
        pendingRef.current.set(key, requestId);
        const path = side === 'front' ? page.frontImage : (page.backImage ?? page.frontImage);

        loader.load(resolveAssetPath(path), (texture) => {
          if (pendingRef.current.get(key) !== requestId || !mountedRef.current) {
            texture.dispose();
            return;
          }
          pendingRef.current.delete(key);
          configurePageTexture(texture, side);

          if (!desiredKeysRef.current.has(key)) texture.dispose();
          else {
            cacheRef.current.get(key)?.dispose();
            cacheRef.current.set(key, texture);
            forceUpdate((version) => version + 1);
          }
        }, undefined, () => {
          if (pendingRef.current.get(key) === requestId) pendingRef.current.delete(key);
        });
      }
    }
  }, [currentIndex, pages]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      for (const texture of cacheRef.current.values()) texture.dispose();
      cacheRef.current.clear();
      pendingRef.current.clear();
    };
  }, []);

  return (index: number): PageTexturePair => {
    const page = pages[index];
    if (!page) return { front: null, back: null };
    return {
      front: cacheRef.current.get(textureKey('front', page)) ?? null,
      back: cacheRef.current.get(textureKey('back', page)) ?? null,
    };
  };
}
