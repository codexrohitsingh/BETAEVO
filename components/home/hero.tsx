"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function Hero() {
  const slides = [
    {
      brand: "BetaEvo",
      title: "Think Smart.",
      highlight: "Wear Smarter.",
      subtitle: "BT Calling | AMOLED Display",
      image: "/photos/product-1.webp",
      bg: "from-[#fde2cf] via-[#fff7f1] to-white",
      ctaBg: "bg-[#7a2e00] hover:bg-[#9a4312]",
      textColor: "text-gray-900",
    },
    {
      brand: "BetaEvo",
      title: "Now Playing",
      highlight: "Through Your Specs",
      subtitle: "Open-Ear Music | Hands-Free Calls",
      image: "/photos/product-2.webp",
      bg: "from-[#d8c2be] via-[#f3eceb] to-white",
      ctaBg: "bg-black hover:bg-gray-800",
      textColor: "text-gray-900",
    },
    
    {
      brand: "BetaEvo",
      title: "Minimal Design.",
      highlight: "Maximum Sound.",
      subtitle: "Designed for nonstop listening",
      image: "/photos/product-3.webp",
      bg: "from-[#eeeeee] via-[#f8f8f8] to-white",
      ctaBg: "bg-black hover:bg-gray-800",
      textColor: "text-gray-900",
    },
    {
      brand: "BetaEvo | Brillia Pro",
      title: "Big. Bold. Brilliant.",
      highlight: "AMOLED That Stands Out.",
      subtitle: "51.3mm AMOLED Display | Rotating Crown",
      image: "/photos/product-4.webp",
      bg: "from-[#0f0f1a] via-[#1b1b2f] to-[#2a2a40]",
      ctaBg: "bg-white text-black hover:bg-gray-100",
      textColor: "text-white",
    },
  ];

  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((p) => (p === 0 ? slides.length - 1 : p - 1));

  const next = () =>
    setActive((p) => (p === slides.length - 1 ? 0 : p + 1));

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((p) => (p === slides.length - 1 ? 0 : p + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[active];

  return (
  <section className="relative w-full px-4 md:px-8">
  <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[36px] h-[600px] md:h-[700px] lg:h-[800px]">

    {/* Slides */}
    {slides.map((s, i) => (
      <div
        key={i}
        className={`
          absolute inset-0 transition-opacity duration-1000 ease-in-out
          ${i === active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}
          rounded-[36px] px-8 md:px-16 py-20 md:py-28
          bg-gradient-to-r ${s.bg}
        `}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* LEFT CONTENT */}
          <div className={`max-w-xl space-y-6 ${s.textColor}`}>
            <span className="text-sm font-semibold tracking-widest uppercase opacity-80">
              {s.brand}
            </span>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              {s.title}
              <br />
              <span className="font-medium opacity-80">{s.highlight}</span>
            </h1>
            <p className="text-lg opacity-80">{s.subtitle}</p>
            <button
              className={`
                mt-6 inline-flex items-center justify-center
                rounded-full ${s.ctaBg} px-12 py-4
                text-sm font-semibold tracking-wide
                shadow-xl backdrop-blur-sm
                transition-all duration-300 transform
                hover:-translate-y-1 hover:scale-105
              `}
            >
              SHOP NOW
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[420px] md:h-[520px] lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent rounded-[36px] pointer-events-none z-10" />
            <Image
              src={s.image}
              alt="Hero product"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    ))}

    {/* LEFT ARROW */}
    <button
      onClick={prev}
      className="absolute z-20 left-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 shadow-lg transition"
    >
      <ChevronLeft size={20} />
    </button>

    {/* RIGHT ARROW */}
    <button
      onClick={next}
      className="absolute z-20 right-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 shadow-lg transition"
    >
      <ChevronRight size={20} />
    </button>

    {/* DOTS */}
    <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
      {slides.map((_, i) => (
        <span
          key={i}
          className={`
            h-2 rounded-full transition-all duration-500
            ${i === active ? "w-6 bg-orange-500 shadow-md" : "w-2 bg-gray-300"}
          `}
        />
      ))}
    </div>

  </div>
</section>

  );
}
