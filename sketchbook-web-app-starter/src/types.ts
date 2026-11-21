export type PublicationStatus = 'published' | 'draft';

export interface CatalogBook {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  coverColor: string;
  createdAt: string;
  displayOrder: number;
  status: PublicationStatus;
  sketchCount: number;
}

export interface Sketch {
  id: string;
  sketchbookId: string;
  title: string;
  description: string;
  artworkImage: string;
  thumbnailImage: string;
  pageTextureImage: string;
  originalImage: string;
  createdAt: string;
  displayOrder: number;
  tags: string[];
  status: PublicationStatus;
}

export interface Sketchbook extends CatalogBook {
  sketches: Sketch[];
}

export interface Catalog {
  version: number;
  books: CatalogBook[];
}
