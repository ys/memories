import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Table } from "@/components/table";
import { getGalleries, getPhotos } from "@/lib/photos";

export function generateStaticParams() {
  return getGalleries().map((gallery) => ({ gallery }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gallery: string }>;
}): Promise<Metadata> {
  const { gallery } = await params;
  const galleries = getGalleries();

  if (!galleries.includes(gallery)) {
    return {
      title: "Gallery Not Found",
    };
  }

  const photos = getPhotos(gallery);
  const photoCount = photos.length;
  const firstPhoto = photos[0]?.src;

  return {
    title: gallery,
    description: `${gallery} - A collection of ${photoCount} polaroid ${photoCount === 1 ? "memory" : "memories"} from everyday life.`,
    openGraph: {
      title: `${gallery} | Memories`,
      description: `${gallery} - ${photoCount} polaroid ${photoCount === 1 ? "memory" : "memories"} captured in small moments.`,
      images: firstPhoto
        ? [
            {
              url: firstPhoto,
              width: 1200,
              height: 1200,
              alt: `Photo from ${gallery}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${gallery} | Memories`,
      description: `${gallery} - ${photoCount} polaroid ${photoCount === 1 ? "memory" : "memories"}`,
      images: firstPhoto ? [firstPhoto] : undefined,
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ gallery: string }>;
}) {
  const { gallery } = await params;
  const galleries = getGalleries();

  if (!galleries.includes(gallery)) {
    notFound();
  }

  const photos = getPhotos(gallery);

  return <Table photos={photos} title={gallery} />;
}
