import Link from 'next/link';

export default function LandingPage() {
  const yellowButtonClasses = "px-10 py-5 bg-[#ffcc00] text-black text-2xl md:text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:brightness-110 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";
  const greenButtonClasses = "px-10 py-5 bg-[#2ecc71] text-black text-2xl md:text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:brightness-110 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";
  const purpleButtonClasses = "px-10 py-5 bg-[#9b59b6] text-white text-2xl md:text-3xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:brightness-125 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none";
  const comingSoonButtonClasses = "relative px-10 py-5 bg-gray-600 text-gray-400 text-2xl md:text-3xl font-bold uppercase border-4 border-gray-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] rounded-none cursor-not-allowed opacity-75";

  return (
    <>
      {/* Static preload for LCP optimization - hoisted to <head> by Next.js */}
      <link
        rel="preload"
        href="/bg-swamp.webp"
        as="image"
        type="image/webp"
      />
      <main className="flex flex-col bg-[#0a0f0a] font-pixel text-white">
        {/* Hero Section */}
        <section
          className="relative flex flex-grow flex-col items-center justify-start overflow-hidden bg-cover bg-center bg-no-repeat [image-rendering:pixelated] bg-[url('/bg-swamp.webp')] min-h-screen py-8 md:py-12"
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

          {/* Middle: spacer fixe pour laisser visible le décor */}
          <div className="h-64 md:h-80 lg:h-96"></div>

          {/* Buttons */}
          <div className="z-10 flex flex-col items-center gap-4 px-4">
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              <Link href="/jsbog" className={yellowButtonClasses}>
                JSBOG
              </Link>
              <Link href="/cbog" className={greenButtonClasses}>
                CBOG
              </Link>
              <Link href="/algobog" className={purpleButtonClasses}>
                ALGOBOG
              </Link>
              <div className={comingSoonButtonClasses}>
                <span className="absolute -top-3 -right-3 px-2 py-1 bg-[#3498db] text-white text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  BIENTÔT
                </span>
                PYBOG
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
