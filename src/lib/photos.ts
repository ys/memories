import fs from "fs";
import path from "path";

export const PHOTO_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export interface PhotoData {
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  rotation: number;
}

const photosRoot = path.join(process.cwd(), "public", "photos");

export function getGalleries(): string[] {
  try {
    return fs
      .readdirSync(photosRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
  } catch {
    return [];
  }
}

const CARD_COLORS = [
  "#b08d6e",
  "#c4a67a",
  "#8c7a6b",
  "#a39080",
  "#c2a57a",
  "#9a8b78",
  "#bfa47d",
  "#a09382",
];

export function pickColor(name: string): string {
  return CARD_COLORS[hashString(name) % CARD_COLORS.length];
}

export function getPhotos(gallery: string): PhotoData[] {
  const dir = path.join(photosRoot, gallery);

  let filenames: string[] = [];
  try {
    filenames = fs
      .readdirSync(dir)
      .filter((f) => PHOTO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort();
  } catch {
    return [];
  }

  return filenames.map((filename) => {
    const hash = hashString(filename);
    const rand = seededRandom(hash);

    const initialX = rand() * 0.7 + 0.05;
    const initialY = rand() * 0.6 + 0.05;
    const rotation = rand() * 24 - 12;

    const alt = path
      .basename(filename, path.extname(filename))
      .replace(/[-_]/g, " ");

    return {
      src: `/photos/${gallery}/${filename}`,
      alt,
      initialX,
      initialY,
      rotation,
    };
  });
}
