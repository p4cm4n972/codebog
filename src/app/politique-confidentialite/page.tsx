import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Politique de confidentialité - CODEBOG.DEV",
  description: "Politique de confidentialité de CODEBOG.DEV - Protection de vos données personnelles conformément au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2ecc71] mb-8 text-center">
          POLITIQUE DE CONFIDENTIALITÉ
        </h1>

        <div className="bg-black border-4 border-[#2ecc71] p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-green-300">
              ITMade Studio, éditeur de CODEBOG.DEV, s&apos;engage à protéger vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>

          {/* Responsable du traitement */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; RESPONSABLE DU TRAITEMENT
            </h2>
            <div className="text-green-300 space-y-2">
              <p><span className="text-yellow-400">Raison sociale :</span> ITMade Studio</p>
              <p>
                <span className="text-yellow-400">Email :</span>{' '}
                <a href="mailto:contact@itmade.fr" className="text-[#2ecc71] hover:text-yellow-400 transition-colors">
                  contact@itmade.fr
                </a>
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; DONNÉES COLLECTÉES
            </h2>
            <div className="text-green-300 space-y-4">
              <p className="text-yellow-400">Lors de l&apos;inscription :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Adresse email</li>
                <li>Nom d&apos;utilisateur (pseudo)</li>
                <li>Mot de passe (chiffré)</li>
              </ul>
              <p className="text-yellow-400 mt-4">Lors de l&apos;utilisation :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Progression dans les exercices</li>
                <li>Code soumis pour les exercices</li>
                <li>Statistiques d&apos;utilisation</li>
              </ul>
            </div>
          </section>

          {/* Utilisation des données */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; UTILISATION DES DONNÉES
            </h2>
            <div className="text-green-300 space-y-2">
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Gérer votre compte utilisateur</li>
                <li>Sauvegarder votre progression</li>
                <li>Améliorer nos exercices et contenus</li>
                <li>Vous contacter en cas de besoin (support)</li>
              </ul>
            </div>
          </section>

          {/* Conservation */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; CONSERVATION DES DONNÉES
            </h2>
            <p className="text-green-300">
              Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont effacées dans un délai de 30 jours.
            </p>
          </section>

          {/* Partage */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; PARTAGE DES DONNÉES
            </h2>
            <p className="text-green-300">
              Nous ne vendons, n&apos;échangeons ni ne transférons vos données personnelles à des tiers, sauf obligation légale.
            </p>
          </section>

          {/* Vos droits */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; VOS DROITS (RGPD)
            </h2>
            <div className="text-green-300 space-y-2">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><span className="text-yellow-400">Accès :</span> obtenir une copie de vos données</li>
                <li><span className="text-yellow-400">Rectification :</span> corriger vos données inexactes</li>
                <li><span className="text-yellow-400">Effacement :</span> demander la suppression de vos données</li>
                <li><span className="text-yellow-400">Opposition :</span> vous opposer au traitement</li>
                <li><span className="text-yellow-400">Portabilité :</span> recevoir vos données dans un format structuré</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits :{' '}
                <a href="mailto:contact@itmade.fr" className="text-[#2ecc71] hover:text-yellow-400 transition-colors">
                  contact@itmade.fr
                </a>
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; SÉCURITÉ
            </h2>
            <p className="text-green-300">
              Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données : chiffrement des mots de passe, connexions sécurisées (HTTPS), accès restreint aux données.
            </p>
          </section>

          {/* Cookies */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; COOKIES
            </h2>
            <p className="text-green-300">
              CODEBOG.DEV utilise uniquement des cookies techniques nécessaires au fonctionnement du site (authentification, préférences). Aucun cookie publicitaire ou de traçage n&apos;est utilisé.
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
