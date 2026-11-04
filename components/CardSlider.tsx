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

export function CardSlider({ children, label, auto = false }: { children: React.ReactNode; label: string; auto?: boolean }) {
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
        <button className="btn btn-secondary" type="button" onClick={() => scrollCards(scroller.current, -1)} aria-label={`Previous ${label}`}>
          Previous
        </button>
        <button className="btn btn-primary" type="button" onClick={() => scrollCards(scroller.current, 1)} aria-label={`Next ${label}`}>
          Next
        </button>
      </div>
      <div ref={scroller} className="card-slider" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
