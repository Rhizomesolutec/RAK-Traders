import Image from "next/image";

const cutPhotos: Record<string, string> = {
  moti: "/images/products/moti/cut.jpg",
  vachras: "/images/products/vachras/cut.jpg",
  moro: "/images/products/mora/cut.jpg",
  jam: "/images/products/jam/cut.jpg",
  jeeni: "/images/products/jeeni/cut.jpg",
  fattor: "/images/products/fattor/cut.jpg",
};

export function samplePhoto(slug: string) {
  return cutPhotos[slug] ?? null;
}

export function PackPhoto({ src, slug, alt, back, compact = false }: { src: string; slug: string; alt: string; back?: string; compact?: boolean }) {
  const sample = back || samplePhoto(slug);
  return (
    <div className={compact ? "pack-photo pack-photo-compact relative mx-auto h-36 w-full" : "pack-photo relative mx-auto h-64 w-full max-w-sm sm:h-72 lg:h-96"}>
      <div className="pack-flip">
        <div className="pack-face">
          <Image src={src} alt={alt} fill className="object-contain object-center" sizes="(max-width: 640px) 90vw, 384px" />
        </div>
        {sample ? (
          <div className="pack-face pack-face-back">
            <Image src={sample} alt={`${alt} sample`} fill className="object-cover" sizes="320px" />
          </div>
        ) : null}
      </div>
      {sample ? (
        <button type="button" className="sample-badge" aria-label="Show the sample photo">
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image src={sample} alt="" fill className="object-cover" sizes="64px" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
