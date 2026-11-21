import { useEffect, useState } from 'react';
import { SRGBColorSpace, Texture, TextureLoader } from 'three';

function resolveAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function usePageTexture(path?: string) {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    setTexture(null);
    if (!path) return;

    let disposed = false;
    let loadedTexture: Texture | null = null;
    const loader = new TextureLoader();

    loader.load(resolveAssetPath(path), (nextTexture) => {
      loadedTexture = nextTexture;
      nextTexture.colorSpace = SRGBColorSpace;
      nextTexture.anisotropy = 4;
      nextTexture.needsUpdate = true;
      if (disposed) nextTexture.dispose();
      else setTexture(nextTexture);
    });

    return () => {
      disposed = true;
      loadedTexture?.dispose();
    };
  }, [path]);

  return texture;
}
