export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2ecc71] mb-8 text-center">
          À PROPOS DU BOG
        </h1>

        <div className="bg-black border-4 border-[#2ecc71] p-8 space-y-6">
          <section>
            <h2 className="text-3xl font-bold text-[#ffcc00] mb-4">
              &gt; POURQUOI "BOG" ?
            </h2>
            <div className="text-green-300 space-y-4 leading-relaxed">
              <p>
                Dans le monde du développement, on utilise souvent le terme <span className="text-yellow-400 font-bold">"piscine"</span> pour décrire ces marathons intensifs de code.
              </p>
              <p>
                Mais soyons honnêtes... quand on pense à une piscine, on imagine un moment <span className="text-blue-400">calme</span>, <span className="text-blue-400">chill</span>, relaxant.
              </p>
              <p className="text-xl text-[#2ecc71] font-bold">
                La réalité ? On est plutôt dans un <span className="text-yellow-400">marécage</span> !
              </p>
            </div>
          </section>

          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; LE BOG, C'EST QUOI ?
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                Un endroit où il est <span className="text-red-400 font-bold">difficile d'avancer</span>, où chaque pas demande des efforts, où on s'enfonce parfois... mais où on apprend à survivre et à progresser malgré tout.
              </p>
              <p>
                Et puis, "bog" ressemble étrangement à <span className="text-red-500 font-bold">"bug"</span> - et franchement, c'est bien de ça qu'il s'agit, non ? 🐛
              </p>
            </div>
          </section>

          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; BIENVENUE DANS LE MARÉCAGE
            </h2>
            <p className="text-green-300 text-lg">
              Alors enfile tes bottes, prépare-toi à te salir les mains, et plonge dans le <span className="text-[#2ecc71] font-bold">CODEBOG</span> ! 💪
            </p>
          </section>

          <div className="mt-8 p-4 bg-green-900/20 border-2 border-green-700 rounded">
            <p className="text-center text-green-400 italic">
              "Dans le bog, on n'apprend pas à nager... on apprend à survivre." 🌿
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
