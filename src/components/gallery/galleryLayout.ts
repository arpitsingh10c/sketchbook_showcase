export interface GalleryLayout {
  columns: number;
  rows: number;
  sceneHeight: number;
}

const DESKTOP_ROW_HEIGHT = 430;
const MOBILE_ROW_HEIGHT = 440;
const MINIMUM_SCENE_HEIGHT = 620;
const SPACING_X = 4.05;
const SPACING_Y = 3.35;

export function getGalleryLayout(bookCount: number, narrow: boolean): GalleryLayout {
  const columns = narrow || bookCount <= 1 ? 1 : 2;
  const rows = Math.ceil(bookCount / columns);
  return {
    columns,
    rows,
    sceneHeight: Math.max(MINIMUM_SCENE_HEIGHT, rows * (narrow ? MOBILE_ROW_HEIGHT : DESKTOP_ROW_HEIGHT)),
  };
}

export function getBookPosition(index: number, rows: number, columns: number): [number, number, number] {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = (column - (columns - 1) / 2) * SPACING_X;
  const y = ((rows - 1) / 2 - row) * SPACING_Y;
  return [x, y, 0];
}
