import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = 68,
  className = "",
}: {
  size?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="RAK TRADERS Home"
      className={`inline-flex shrink-0 items-center transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <Image
        src="/images/logo/logo-transparent.webp"
        alt="RAK TRADERS"
        width={size}
        height={size}
        className="object-contain drop-shadow-[0_2px_10px_rgba(201,162,75,0.22)]"
        style={{ width: size, height: size }}
        priority
      />
    </Link>
  );
}
