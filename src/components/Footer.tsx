import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#1a2e1a] p-4 font-mono text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
          <p className="text-green-400 text-sm">
            © {new Date().getFullYear()} ITMade Studio - Tous droits réservés
          </p>
          <p className="text-yellow-400 text-sm font-bold">
            VERSION BÊTA
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link href="/mentions-legales" className="text-green-500 hover:text-yellow-400 transition-colors">
            Mentions légales
          </Link>
          <span className="text-green-700">|</span>
          <Link href="/politique-confidentialite" className="text-green-500 hover:text-yellow-400 transition-colors">
            Confidentialité
          </Link>
          <span className="text-green-700">|</span>
          <Link href="/cgu" className="text-green-500 hover:text-yellow-400 transition-colors">
            CGU
          </Link>
        </div>
      </div>
    </footer>
  );
}
