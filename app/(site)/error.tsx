"use client";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section-wrap py-20">
      <h1 className="text-4xl font-semibold text-forest">Something went wrong</h1>
      <p className="mt-3 max-w-xl text-lg leading-8">This page could not be loaded. Please try again.</p>
      <button className="btn btn-primary mt-6" type="button" onClick={reset}>Try again</button>
    </section>
  );
}
