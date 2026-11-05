"use client";

import { useEffect, useRef } from "react";

function scrollCards(element: HTMLDivElement | null, direction: number) {
  if (!element) return;
  const card = element.querySelector<HTMLElement>(":scope > *");
  const distance = card ? card.offsetWidth + 12 : element.clientWidth;
  const max = element.scrollWidth - element.clientWidth - 8;
  if (direction > 0 && element.scrollLeft >= max) {
    element.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }
  element.scrollBy({ left: direction * distance, behavior: "smooth" });
}

export function CardSlider({ children, label, auto = true, compact = false }: { children: React.ReactNode; label: string; auto?: boolean; compact?: boolean }) {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!paused.current) scrollCards(scroller.current, 1);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [auto]);

  return (
    <div onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
      <div className="mb-3 flex justify-end gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-full border border-[#e4e7ec] bg-white text-xl leading-none" type="button" onClick={() => scrollCards(scroller.current, -1)} aria-label={`Previous ${label}`}>
          ‹
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-[#c2410c] text-xl leading-none text-white" type="button" onClick={() => scrollCards(scroller.current, 1)} aria-label={`Next ${label}`}>
          ›
        </button>
      </div>
      <div ref={scroller} className={compact ? "card-slider card-slider-compact" : "card-slider"} aria-label={label}>
        {children}
      </div>
    </div>
  );
}
