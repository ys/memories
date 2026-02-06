import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import {
  getGalleries,
  getPhotoCount,
  getPreviewPhotos,
  hashString,
  seededRandom,
  pickColor,
} from "@/lib/photos";
import { GalleryBoard } from "@/components/gallery-board";
import siteConfig from "../../site.config";

function readHomeContent() {
  const filePath = path.join(process.cwd(), "content", "home.md");
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    const lines = raw.split("\n").filter((l) => l.trim() !== "");
    const title = lines[0]?.replace(/^#+\s*/, "") || "";
    const description = lines.slice(1).join(" ").trim();
    return { title, description };
  } catch {
    return { title: "", description: "" };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = readHomeContent();
  return {
    title: title || siteConfig.title,
    description: description || siteConfig.description,
  };
}

export default function Home() {
  const { title, description } = readHomeContent();
  const names = getGalleries();
  const n = names.length;

  const cols = Math.min(n, 4);
  const rows = Math.ceil(n / cols);
  const cellW = 0.7 / cols;
  const cellH = 0.6 / rows;

  const galleries = names.map((name, i) => {
    const hash = hashString(name);
    const rand = seededRandom(hash);

    const col = i % cols;
    const row = Math.floor(i / cols);

    const baseX = 0.1 + cellW * col + cellW / 2 - 0.08;
    const baseY = 0.15 + cellH * row + cellH / 2 - 0.09;
    const jitterX = (rand() - 0.5) * cellW * 0.3;
    const jitterY = (rand() - 0.5) * cellH * 0.3;

    return {
      name,
      initialX: baseX + jitterX,
      initialY: baseY + jitterY,
      rotation: rand() * 16 - 8,
      color: pickColor(name),
      photoCount: getPhotoCount(name),
      previews: getPreviewPhotos(name, 5),
    };
  });

  return (
    <GalleryBoard
      galleries={galleries}
      title={title}
      description={description}
    />
  );
}
