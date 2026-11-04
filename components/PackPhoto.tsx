import Image from "next/image";

const sampleGrades = new Set(["moti", "vachras", "moro"]);

export function samplePhoto(slug: string) {
  return sampleGrades.has(slug) ? `/images/products/${slug}/cut.jpg` : null;
}

export function PackPhoto({ src, slug, alt }: { src: string; slug: string; alt: string }) {
  const sample = samplePhoto(slug);
  return (
    <div className="pack-photo relative h-72 w-full">
      <div className="pack-flip">
        <div className="pack-face">
          <Image src={src} alt={alt} fill className="object-cover" sizes="320px" />
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
