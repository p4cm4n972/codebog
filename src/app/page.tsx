"use client";

import Link from 'next/link';

export default function LandingPage() {
  const yellowButtonClasses = "px-10 py-5 bg-[#ffcc00] text-black text-2xl md:text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";
  const greenButtonClasses = "px-10 py-5 bg-[#2ecc71] text-black text-2xl md:text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";

  return (
    <main className="flex flex-col bg-[#0a0f0a] font-pixel text-white">
      {/* Hero Section */}
      <section
        className="relative flex flex-grow flex-col items-center justify-between overflow-hidden bg-cover bg-center bg-no-repeat [image-rendering:pixelated] bg-[url('/bg-swamp.webp')] min-h-screen py-8 md:py-12"
      >
        {/* Dark overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

        {/* Top: Title + Tagline */}
        <div className="z-10 flex flex-col items-center text-center px-4 pt-4 md:pt-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] text-[#2ecc71] mb-4">
            CODEBOG
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] max-w-xl">
            Learn to code in the bog
          </p>
        </div>

        {/* Middle: Empty space for mascot visibility */}
        <div className="flex-grow"></div>

        {/* Bottom: Buttons */}
        <div className="z-10 flex flex-col gap-4 md:flex-row md:gap-8 px-4 pb-8 md:pb-16">
          <Link href="/jsbog" className={yellowButtonClasses}>
            JSBOG
          </Link>
          <Link href="/cbog" className={greenButtonClasses}>
            CBOG
          </Link>
        </div>
      </section>
    </main>
  );
}
