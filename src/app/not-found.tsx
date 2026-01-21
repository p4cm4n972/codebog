import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-pixel text-white p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Code */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-black text-[#2ecc71] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 border-4 border-red-500 bg-red-900/20 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-4 uppercase">
            Page Not Found
          </h2>
          <p className="text-lg text-red-200 font-mono">
            ERROR: The requested resource could not be located in the bog.
          </p>
        </div>

        {/* ASCII Art Frog */}
        <pre className="text-[#2ecc71] text-xs md:text-sm mb-8 font-mono leading-tight">
{`
     @..@
    (----)
   ( >__< )
   ^^ ~~ ^^
   LOST FROG
`}
        </pre>

        {/* Message */}
        <p className="text-gray-400 mb-8 text-lg">
          It seems you&apos;ve wandered into uncharted territory...
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-[#2ecc71] text-black text-xl font-bold uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
          >
            Return Home
          </Link>
          <Link
            href="/jsbog"
            className="px-8 py-4 bg-[#ffcc00] text-black text-xl font-bold uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
          >
            JSBOG
          </Link>
          <Link
            href="/cbog"
            className="px-8 py-4 bg-[#3498db] text-black text-xl font-bold uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
          >
            CBOG
          </Link>
        </div>
      </div>
    </main>
  );
}
