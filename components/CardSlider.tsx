"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function scrollCards(element: HTMLDivElement | null, direction: number) {
  if (!element) return;
  const card = element.querySelector<HTMLElement>(":scope > *");
  const distance = card ? card.offsetWidth + 20 : element.clientWidth;
  const max = element.scrollWidth - element.clientWidth - 8;
  if (direction > 0 && element.scrollLeft >= max) {
    element.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }
  element.scrollBy({ left: direction * distance, behavior: "smooth" });
}

export function CardSlider({
  children,
  label,
  auto = true,
  compact = false,
}: {
  children: React.ReactNode;
  label: string;
  auto?: boolean;
  compact?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!paused.current) scrollCards(scroller.current, 1);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [auto]);

  return (
    <div
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#dfd7cc] bg-white text-ink shadow-xs transition-all hover:border-[#c9a24b] hover:bg-[#faf7f2] active:scale-95"
          type="button"
          onClick={() => scrollCards(scroller.current, -1)}
          aria-label={`Previous ${label}`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#13110f] text-[#e7c97a] shadow-sm transition-all hover:bg-[#2a241e] active:scale-95"
          type="button"
          onClick={() => scrollCards(scroller.current, 1)}
          aria-label={`Next ${label}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div
        ref={scroller}
        className={compact ? "card-slider card-slider-compact" : "card-slider"}
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}
