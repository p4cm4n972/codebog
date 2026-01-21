import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#1a2e1a] p-4 font-mono text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
        {/* Ko-fi Support Button */}
        <a
          href="https://ko-fi.com/codebog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff5e5b] text-white font-bold rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311z"/>
          </svg>
          Soutenir le projet
        </a>

        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
          <p className="text-green-400 text-sm">
            © 2025 - {new Date().getFullYear()} CODEBOG - Tous droits réservés
          </p>
          <p className="text-gray-400 text-sm">
            Développé par <a href="https://itmade.studio" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors">ITMade Studio</a>
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
