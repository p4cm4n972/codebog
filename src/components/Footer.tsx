export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#1a2e1a] p-4 font-mono text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-green-400 text-sm">
          © {new Date().getFullYear()} ITMade Studio - Tous droits réservés
        </p>
        <p className="text-yellow-400 text-sm font-bold">
          VERSION BÊTA
        </p>
      </div>
    </footer>
  );
}
