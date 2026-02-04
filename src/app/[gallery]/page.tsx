import { notFound } from "next/navigation";
import { Table } from "@/components/table";
import { getGalleries, getPhotos } from "@/lib/photos";

export function generateStaticParams() {
  return getGalleries().map((gallery) => ({ gallery }));
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
