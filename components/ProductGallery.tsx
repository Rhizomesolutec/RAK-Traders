"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const photos = images.length > 0 ? images : [];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const current = photos[index] ?? photos[0];
  if (!current) return null;

  return (
    <div>
      <button type="button" className="relative block h-64 w-full rounded-lg bg-[#f4f5f7] sm:h-80" onClick={() => setOpen(true)} aria-label="Enlarge product photo">
        <Image src={current} alt={`${name} product photo`} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" priority />
      </button>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {photos.map((src, photoIndex) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(photoIndex)}
            className={`relative h-16 bg-[#f4f5f7] ${photoIndex === index ? "ring-2 ring-forest" : ""}`}
            aria-label={`Show photo ${photoIndex + 1}`}
            aria-current={photoIndex === index}
          >
            <Image src={src} alt="" fill className="object-contain" sizes="120px" />
          </button>
        ))}
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#142920]/90 p-4" role="dialog" aria-modal="true" aria-label={`${name} photo`}>
          <button type="button" className="absolute top-4 right-4 bg-cream px-4 py-2 text-forest" onClick={() => setOpen(false)}>Close</button>
          <div className="relative h-[min(82vh,760px)] w-full max-w-4xl">
            <Image src={current} alt={`${name} enlarged`} fill className="object-contain" sizes="90vw" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
