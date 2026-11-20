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

export function PackPhoto({
  src,
  slug,
  alt,
  back,
  compact = false,
  badge,
}: {
  src: string;
  slug: string;
  alt: string;
  back?: string;
  compact?: boolean;
  badge?: string;
}) {
  const sample = back || samplePhoto(slug);
  return (
    <div
      className={`pack-photo relative w-full overflow-hidden bg-gradient-to-b from-[#f7f3ec] to-[#ece5da] ${
        compact ? "pack-photo-compact aspect-square" : "aspect-[4/3]"
      }`}
    >
      {/* Subtle radial studio pedestal glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.75)_0%,transparent_72%)]" />

      {badge ? (
        <span className="pointer-events-none absolute top-3 right-3 z-[3] rounded-full border border-[#d6c3a1]/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#6b4c1e] uppercase shadow-xs backdrop-blur-sm">
          {badge}
        </span>
      ) : null}

      <div className="pack-flip">
        <div className={`pack-face ${compact ? "p-4" : "p-5"}`}>
          <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain object-center drop-shadow-[0_12px_18px_rgba(28,25,23,0.16)]"
              sizes={compact ? "(max-width: 640px) 60vw, 240px" : "(max-width: 640px) 92vw, 400px"}
            />
          </div>
        </div>
        {sample ? (
          <div className="pack-face pack-face-back">
            <Image
              src={sample}
              alt={`${alt} sample cut`}
              fill
              className="object-cover object-center"
              sizes={compact ? "240px" : "400px"}
            />
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-[#13110f]/75 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#e7c97a] uppercase backdrop-blur-sm">
              Cut Preview
            </span>
          </div>
        ) : null}
      </div>

      {sample ? (
        <button
          type="button"
          className="sample-badge"
          title="Hover to inspect cut sample"
          aria-label="Show the cut sample photo"
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image src={sample} alt="" fill className="object-cover" sizes="64px" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
