import Link from "next/link";
import Image from "next/image";
import TypewriterHeading from "./TypewriterHeading";

const HERO_PREFIX = "Next-generation architectural finishes,";
const HERO_SUFFIXES = [
  " at your fingertips.",
  " ready to ship.",
  " promised to deliver.",
];

export default function HeroBanner() {
  return (
    <section className="relative flex h-[600px] items-center bg-saro-dark">
      {/* Background image from Figma */}
      <Image
        src="/images/hero-background.jpg"
        alt="Architectural wood deck finish"
        fill
        className="object-cover opacity-60"
        priority
        sizes="100vw"
      />
      {/* Gradient overlay matching Figma */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 lg:px-[360px]">
        <p className="mb-2 text-sm tracking-wider text-saro-green-light">
          Stored locally in Houston, Texas
        </p>
        <TypewriterHeading
          prefix={HERO_PREFIX}
          messages={HERO_SUFFIXES}
          className="mb-4 max-w-[600px] text-[40px] font-semibold leading-tight text-white"
        />
        <p className="mb-6 max-w-[500px] text-[14px] leading-relaxed text-gray-300">
          Premium WPC siding, decking, and wall panels built for strength, style, and sustainability. Serving contractors, developers, and wholesalers from our Houston warehouse across the Southwest.
        </p>
        <div className="flex gap-3">
          <Link
            href="/contact"
            className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
          >
            Start a Quote
          </Link>
          <Link
            href="/products"
            className="inline-block rounded border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            See Products
          </Link>
        </div>
      </div>
    </section>
  );
}
