"use client";
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white flex flex-col font-mono">
      {/* Styles injectés pour le responsive background */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero {
          min-height: calc(100vh - 72px);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          image-rendering: pixelated;
        }

        @media (min-width: 768px) {
          .hero {
            background-image: url("/bg-bog-desktop-02.png");
          }
        }

        @media (max-width: 767px) {
          .hero {
            background-image: url("/bg-bog-mobile.webp");
          }
        }
      `}} />

      {/* Navbar */}
      <nav className="p-4 border-b-4 border-black bg-[#1a2e1a] flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          {/* Ton icône de profil Manicou */}
          <img 
            src="/icon_manicou.png" 
            alt="Logo Manicou" 
            className="w-10 h-10" 
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-xl font-bold tracking-tighter">CODEBOG</span>
        </div>
        <div className="hidden md:block text-sm opacity-80 uppercase tracking-widest">
          ITMADE SASU
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Overlay pour améliorer la lisibilité si le background est trop clair */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

        <h1 className="text-5xl md:text-8xl font-black mb-12 text-center z-10 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          CODEBOG.DEV
        </h1>

        {/* Boutons Centraux */}
        <div className="flex flex-col md:flex-row gap-8 z-10">
          <button className="bg-[#ffcc00] text-black px-10 py-5 text-3xl font-bold border-b-8 border-r-8 border-black hover:translate-y-1 hover:translate-x-1 hover:border-b-4 hover:border-r-4 active:translate-y-2 active:translate-x-2 active:border-b-0 active:border-r-0 transition-all uppercase">
            JSBOG
          </button>
          <button className="bg-[#2ecc71] text-black px-10 py-5 text-3xl font-bold border-b-8 border-r-8 border-black hover:translate-y-1 hover:translate-x-1 hover:border-b-4 hover:border-r-4 active:translate-y-2 active:translate-x-2 active:border-b-0 active:border-r-0 transition-all uppercase">
            CBOG
          </button>
        </div>
      </section>
    </main>
  )
}