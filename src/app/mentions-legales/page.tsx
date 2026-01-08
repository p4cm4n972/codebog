import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mentions légales - CODEBOG.DEV",
  description: "Mentions légales du site CODEBOG.DEV - Informations sur l'éditeur ITMade Studio, hébergement et propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2ecc71] mb-8 text-center">
          MENTIONS LÉGALES
        </h1>

        <div className="bg-black border-4 border-[#2ecc71] p-8 space-y-8">
          {/* Éditeur */}
          <section>
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ÉDITEUR DU SITE
            </h2>
            <div className="text-green-300 space-y-2">
              <p><span className="text-yellow-400">Raison sociale :</span> ITMade Studio</p>
              <p><span className="text-yellow-400">Forme juridique :</span> SASU (en cours d&apos;immatriculation)</p>
              <p><span className="text-yellow-400">SIRET :</span> En cours d&apos;attribution</p>
              <p><span className="text-yellow-400">Siège social :</span> Quartier Perriolat, 97240 Le François, Martinique</p>
              <p><span className="text-yellow-400">Directeur de publication :</span> Manuel ADELE</p>
              <p>
                <span className="text-yellow-400">Email :</span>{' '}
                <a href="mailto:contact@itmade.fr" className="text-[#2ecc71] hover:text-yellow-400 transition-colors">
                  contact@itmade.fr
                </a>
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; HÉBERGEMENT
            </h2>
            <div className="text-green-300 space-y-2">
              <p><span className="text-yellow-400">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="text-yellow-400">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p>
                <span className="text-yellow-400">Site web :</span>{' '}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#2ecc71] hover:text-yellow-400 transition-colors">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; PROPRIÉTÉ INTELLECTUELLE
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                L&apos;ensemble du contenu présent sur le site CODEBOG.DEV (textes, images, code source, logos, graphismes) est protégé par les droits de propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.
              </p>
              <p>
                Les exercices de code proposés sont destinés à un usage éducatif personnel.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; DONNÉES PERSONNELLES
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                Les données collectées lors de l&apos;inscription (email, pseudo) sont utilisées uniquement pour le fonctionnement du service.
              </p>
              <p>
                Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
              </p>
              <p>
                Pour plus d&apos;informations, consultez notre{' '}
                <a href="/politique-confidentialite" className="text-[#2ecc71] hover:text-yellow-400 transition-colors underline">
                  politique de confidentialité
                </a>.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; DROIT APPLICABLE
            </h2>
            <p className="text-green-300">
              Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux de Fort-de-France (Martinique) seront compétents.
            </p>
          </section>

          {/* Date de mise à jour */}
          <div className="mt-8 p-4 bg-green-900/20 border-2 border-green-700 rounded">
            <p className="text-center text-green-400 text-sm">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
