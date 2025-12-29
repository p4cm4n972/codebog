"use client";
import Auth from "@/components/Auth";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0f0a] font-pixel text-white">
      {/* Navbar */}
      <nav className="z-10 flex items-center justify-between border-b-4 border-black bg-[#1a2e1a] p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tighter">CODEBOG</span>
        </div>
        <Auth />
      </nav>

      {/* Hero Section */}
      <section
        className="relative flex flex-grow flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat [image-rendering:pixelated] md:bg-[url('/bg-bog-desktop-02.png')] bg-[url('/bg-bog-mobile.webp')]"
      >
        <div className="pointer-events-none absolute inset-0 bg-black/20"></div>

        <h1 className="drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] z-10 mb-12 text-center text-5xl font-black md:text-8xl">
          CODEBOG.DEV
        </h1>

        <div className="z-10 flex flex-col gap-8 md:flex-row">
          <button className="border-r-8 border-b-8 border-black bg-[#ffcc00] px-10 py-5 text-3xl font-bold uppercase text-black active:translate-x-2 active:translate-y-2 active:border-b-0 active:border-r-0 hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4">
            JSBOG
          </button>
          <button className="border-r-8 border-b-8 border-black bg-[#2ecc71] px-10 py-5 text-3xl font-bold uppercase text-black active:translate-x-2 active:translate-y-2 active:border-b-0 active:border-r-0 hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4">
            CBOG
          </button>
        </div>
      </section>
    </main>
  );
}