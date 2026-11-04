import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-wrap py-20">
      <h1 className="text-4xl font-semibold text-forest">Page not found</h1>
      <p className="mt-3 text-lg">That page is not on the RAK TRADERS site.</p>
      <Link href="/" className="btn btn-primary mt-6">Back to home</Link>
    </section>
  );
}
