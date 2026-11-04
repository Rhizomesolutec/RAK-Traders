import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 48, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/images/logo/logo.png"
        alt="RAK TRADERS"
        width={size}
        height={size}
        className={dark ? "rounded-lg" : "rounded-lg bg-forest-deep"}
        priority
      />
      <span className="min-w-0 leading-tight">
        <span className={`block text-sm font-semibold tracking-wide sm:text-base ${dark ? "text-white" : "text-forest"}`}>
          RAK TRADERS
        </span>
        <span className={`hidden text-sm xl:block ${dark ? "text-sand" : "text-muted"}`}>Premium Quality Arecanut</span>
      </span>
    </Link>
  );
}
