import fs from "fs";
import path from "path";

export { hashString, seededRandom } from "./utils";
import { hashString, seededRandom } from "./utils";

export const PHOTO_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

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

export function getPhotoCount(gallery: string): number {
  const dir = path.join(photosRoot, gallery);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => PHOTO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .length;
  } catch {
    return 0;
  }
}

export function getPreviewPhotos(gallery: string, count: number): string[] {
  const dir = path.join(photosRoot, gallery);
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => PHOTO_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort();
    const rand = seededRandom(hashString(gallery + "preview"));
    const shuffled = files
      .map((f) => ({ f, sort: rand() }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.f);
    return shuffled.slice(0, count).map((f) => `/photos/${gallery}/${f}`);
  } catch {
    return [];
  }
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
