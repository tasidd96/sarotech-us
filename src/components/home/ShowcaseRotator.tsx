"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SHOWCASE = [
  { src: "/images/showcase/residential.jpg", alt: "SARO TECH residential installation" },
  { src: "/images/showcase/showroom.jpg",    alt: "SARO TECH showroom" },
  { src: "/images/showcase/signage.jpg",     alt: "SARO TECH signage and branded storefront" },
  { src: "/images/showcase/warehouse.jpg",   alt: "SARO TECH warehouse and fulfillment" },
];

const INTERVAL_MS = 5000;

export default function ShowcaseRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SHOWCASE.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black">
      {SHOWCASE.map((item, i) => (
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SHOWCASE.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
