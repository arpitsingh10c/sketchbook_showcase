import { Canvas, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import {
  Component,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { Group, OrthographicCamera } from 'three';
import {
  defaultBookTransition,
  type BookTransitionConfig,
} from '../../animation/bookTransitions';
import type { PageTurnConfig, PageTurnDirection } from '../../animation/pageAnimations';
import type { AppMode, CatalogBook } from '../../content/types';
import {
  GALLERY_BOOK_ROTATION,
} from '../book/bookDimensions';
import { Sketchbook3D, type Sketchbook3DHandle } from '../book/Sketchbook3D';
import type { SketchbookPage } from '../book/pageTypes';
import { getBookPosition } from '../gallery/galleryLayout';
import { defaultGalleryCamera, type GalleryCameraConfig } from './galleryCamera';
import { calculateReadingTransform } from './readingTransform';
import { SceneLighting } from './SceneLighting';

interface SketchbookSceneProps {
  activeSlug: string | null;
  books: CatalogBook[];
  cameraConfig?: GalleryCameraConfig;
  columns: number;
  hoveredId: string | null;
  mode: AppMode;
  narrow: boolean;
  onCloseComplete: () => void;
  onOpenComplete: () => void;
  currentPageIndex: number;
  onPageTurnComplete: () => void;
  pages: SketchbookPage[];
  pageTurnConfig?: PageTurnConfig;
  pageTurnDirection: PageTurnDirection | null;
  reducedMotion: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  transitionConfig?: BookTransitionConfig;
}

interface SceneErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError: () => void;
}

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function CameraRig({ narrow, config }: { narrow: boolean; config: GalleryCameraConfig }) {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    const position = narrow ? config.mobilePosition : config.desktopPosition;
    camera.position.set(...position);
    camera.zoom = narrow
      ? Math.min(config.maxMobileZoom, size.width * config.mobileZoomScale)
      : Math.min(config.maxDesktopZoom, size.width * config.desktopZoomScale);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, config, narrow, size.width]);

  return null;
}

interface TransitionDirectorProps {
  activeSlug: string | null;
  actorRefs: RefObject<Map<string, Group>>;
  bookRefs: RefObject<Map<string, Sketchbook3DHandle>>;
  cameraConfig: GalleryCameraConfig;
  mode: AppMode;
  onCloseComplete: () => void;
  onOpenComplete: () => void;
  reducedMotion: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  transitionConfig: BookTransitionConfig;
}

function TransitionDirector({
  activeSlug,
  actorRefs,
  bookRefs,
  cameraConfig,
  mode,
  onCloseComplete,
  onOpenComplete,
  reducedMotion,
  stageRef,
  transitionConfig,
}: TransitionDirectorProps) {
  const { camera } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const openedSlugRef = useRef<string | null>(null);
  const originalBodyOverflowRef = useRef('');

  useLayoutEffect(() => {
    if (mode !== 'opening' || !activeSlug || openedSlugRef.current === activeSlug) return;

    const actor = actorRefs.current.get(activeSlug);
    const book = bookRefs.current.get(activeSlug);
    const cover = book?.cover;
    const introPage = book?.introPage;
    const stage = stageRef.current;
    if (!actor || !cover || !introPage || !stage || !(camera instanceof OrthographicCamera)) return;

    openedSlugRef.current = activeSlug;
    const stageRect = stage.getBoundingClientRect();
    const readingTransform = calculateReadingTransform({
      camera,
      cameraConfig,
      transitionConfig,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    });
    const introPageOriginX = introPage.position.x;
    const motionFactor = reducedMotion ? 0.01 : 1;
    const time = (seconds: number) => seconds * motionFactor;
    const uiTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-ui]'));
    const secondaryActors = Array.from(actorRefs.current.entries())
      .filter(([slug]) => slug !== activeSlug)
      .map(([, group]) => group);

    originalBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    gsap.set(stage, {
      position: 'fixed',
      top: stageRect.top,
      left: stageRect.left,
      width: stageRect.width,
      height: stageRect.height,
      margin: 0,
      zIndex: 20,
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: onOpenComplete,
      onReverseComplete: () => {
        gsap.set(stage, { clearProps: 'position,top,left,width,height,margin,zIndex' });
        document.body.style.overflow = originalBodyOverflowRef.current;
        openedSlugRef.current = null;
        timelineRef.current = null;
        onCloseComplete();
      },
    });

    timeline
      .to(stage, {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        duration: time(transitionConfig.stageDuration),
        ease: 'power3.inOut',
      }, 0)
      .to(uiTargets, {
        yPercent: -125,
        opacity: 0,
        duration: time(transitionConfig.uiDuration),
        stagger: time(0.035),
        ease: 'power2.in',
        pointerEvents: 'none',
      }, 0)
      .to(secondaryActors.map((group) => group.scale), {
        x: transitionConfig.secondaryScale,
        y: transitionConfig.secondaryScale,
        z: transitionConfig.secondaryScale,
        duration: time(transitionConfig.riseDuration * 0.72),
        ease: 'power2.out',
      }, 0)
      .to(secondaryActors.map((group) => group.position), {
        z: transitionConfig.secondaryDepth,
        duration: time(transitionConfig.riseDuration * 0.72),
        ease: 'power2.out',
      }, 0)
      .to(actor.position, {
        x: readingTransform.position.x,
        y: readingTransform.position.y,
        z: readingTransform.position.z,
        duration: time(transitionConfig.riseDuration),
        ease: 'power3.inOut',
      }, time(0.04))
      .to(actor.rotation, {
        x: readingTransform.rotation.x,
        y: readingTransform.rotation.y,
        z: readingTransform.rotation.z,
        duration: time(transitionConfig.riseDuration),
        ease: 'power3.inOut',
      }, time(0.04))
      .to(actor.scale, {
        x: readingTransform.scale * (reducedMotion ? 1 : transitionConfig.settleOvershoot),
        y: readingTransform.scale * (reducedMotion ? 1 : transitionConfig.settleOvershoot),
        z: readingTransform.scale * (reducedMotion ? 1 : transitionConfig.settleOvershoot),
        duration: time(transitionConfig.riseDuration),
        ease: 'power3.inOut',
      }, time(0.04))
      .to(cover.rotation, {
        y: -transitionConfig.coverOpenAngle,
        duration: time(transitionConfig.coverDuration),
        ease: 'power2.inOut',
      }, time(transitionConfig.coverStart))
      .to(introPage.rotation, {
        y: -transitionConfig.pageOpenAngle,
        duration: time(transitionConfig.pageDuration),
        ease: 'power2.inOut',
      }, time(transitionConfig.pageStart))
      .to(introPage.position, {
        x: introPageOriginX - readingTransform.leftPageOffset,
        duration: time(transitionConfig.settleDuration * 1.25),
        ease: 'power2.in',
      }, time(transitionConfig.pageStart + transitionConfig.pageDuration * 0.55))
      .to(actor.scale, {
        x: readingTransform.scale,
        y: readingTransform.scale,
        z: readingTransform.scale,
        duration: time(transitionConfig.settleDuration),
        ease: 'back.out(1.45)',
      }, time(transitionConfig.settleStart));

    timelineRef.current = timeline;
  }, [
    activeSlug,
    actorRefs,
    bookRefs,
    camera,
    cameraConfig,
    mode,
    onCloseComplete,
    onOpenComplete,
    reducedMotion,
    stageRef,
    transitionConfig,
  ]);

  useLayoutEffect(() => {
    if (mode !== 'closing') return;
    const timeline = timelineRef.current;
    if (timeline) timeline.reverse();
    else onCloseComplete();
  }, [mode, onCloseComplete]);

  useEffect(() => () => {
    timelineRef.current?.kill();
    if (stageRef.current) gsap.set(stageRef.current, { clearProps: 'position,top,left,width,height,margin,zIndex' });
    document.body.style.overflow = originalBodyOverflowRef.current;
  }, [stageRef]);

  return null;
}

export function SketchbookScene({
  activeSlug,
  books,
  cameraConfig = defaultGalleryCamera,
  columns,
  hoveredId,
  mode,
  narrow,
  onCloseComplete,
  onOpenComplete,
  currentPageIndex,
  onPageTurnComplete,
  pages,
  pageTurnConfig,
  pageTurnDirection,
  reducedMotion,
  stageRef,
  transitionConfig = defaultBookTransition,
}: SketchbookSceneProps) {
  const rows = Math.ceil(books.length / columns);
  const actorRefs = useRef(new Map<string, Group>());
  const bookRefs = useRef(new Map<string, Sketchbook3DHandle>());
  const [webglFailed, setWebglFailed] = useState(false);
  const positions = useMemo(
    () => books.map((_, index) => getBookPosition(index, rows, columns)),
    [books, columns, rows],
  );

  useEffect(() => {
    if (!webglFailed) return;
    if (mode === 'opening') onOpenComplete();
    if (mode === 'closing') onCloseComplete();
  }, [mode, onCloseComplete, onOpenComplete, webglFailed]);

  return (
    <SceneErrorBoundary
      onError={() => setWebglFailed(true)}
      fallback={(
        <div
          className="webgl-fallback"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {books.map((book) => (
            <div className="fallback-slot" key={book.id}>
              <div className="fallback-book" style={{ backgroundColor: book.coverColor }}><span /></div>
            </div>
          ))}
        </div>
      )}
    >
      <Canvas
        className="gallery-canvas"
        orthographic
        camera={{ position: [0, 4.7, 12], zoom: 110, near: 0.1, far: 50 }}
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <CameraRig narrow={narrow} config={cameraConfig} />
        <SceneLighting />
        {books.map((book, index) => (
          <group
            key={book.id}
            ref={(group) => {
              if (group) actorRefs.current.set(book.slug, group);
              else actorRefs.current.delete(book.slug);
            }}
            position={positions[index]}
            rotation={[...GALLERY_BOOK_ROTATION]}
          >
            <Sketchbook3D
              ref={(handle) => {
                if (handle) bookRefs.current.set(book.slug, handle);
                else bookRefs.current.delete(book.slug);
              }}
              coverColor={book.coverColor}
              currentPageIndex={activeSlug === book.slug ? currentPageIndex : 0}
              hovered={mode === 'gallery' && hoveredId === book.id}
              onPageTurnComplete={onPageTurnComplete}
              pages={activeSlug === book.slug ? pages : []}
              pageTurnConfig={pageTurnConfig}
              pageTurnDirection={activeSlug === book.slug ? pageTurnDirection : null}
              reducedMotion={reducedMotion}
            />
          </group>
        ))}
        <TransitionDirector
          activeSlug={activeSlug}
          actorRefs={actorRefs}
          bookRefs={bookRefs}
          cameraConfig={cameraConfig}
          mode={mode}
          onCloseComplete={onCloseComplete}
          onOpenComplete={onOpenComplete}
          reducedMotion={reducedMotion}
          stageRef={stageRef}
          transitionConfig={transitionConfig}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
}
