"use client";

import Link from 'next/link';

export default function LandingPage() {
  const yellowButtonClasses = "px-10 py-5 bg-[#ffcc00] text-black text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";
  const greenButtonClasses = "px-10 py-5 bg-[#2ecc71] text-black text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";

  return (
    <main className="flex flex-col bg-[#0a0f0a] font-pixel text-white">
      {/* Hero Section */}
      <section
        className="relative flex flex-grow flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat [image-rendering:pixelated] md:bg-[url('/bg-bog-desktop-02.png')] bg-[url('/bg-bog-mobile.webp')] min-h-screen"
      >
        <div className="pointer-events-none absolute inset-0 bg-black/20"></div>

        <h1 className="drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-10 mb-12 text-center text-5xl font-black md:text-8xl">
          CODEBOG.DEV
        </h1>

        <div className="z-10 flex flex-col gap-8 md:flex-row">
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
