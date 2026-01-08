import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - CODEBOG.DEV",
  description: "CGU de CODEBOG.DEV - Conditions d'accès et d'utilisation de la plateforme d'apprentissage du code.",
};

export default function CGUPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2ecc71] mb-8 text-center">
          CONDITIONS GÉNÉRALES D&apos;UTILISATION
        </h1>

        <div className="bg-black border-4 border-[#2ecc71] p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-green-300">
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la plateforme CODEBOG.DEV, éditée par ITMade Studio.
            </p>
            <p className="text-green-300 mt-4">
              En utilisant CODEBOG.DEV, vous acceptez sans réserve les présentes CGU.
            </p>
          </section>

          {/* Article 1 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 1 - OBJET
            </h2>
            <p className="text-green-300">
              CODEBOG.DEV est une plateforme éducative d&apos;apprentissage de la programmation. Elle propose des exercices interactifs de code, des parcours d&apos;apprentissage et un suivi de progression.
            </p>
          </section>

          {/* Article 2 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 2 - ACCÈS AU SERVICE
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                L&apos;accès à certains contenus nécessite la création d&apos;un compte utilisateur. L&apos;inscription est gratuite.
              </p>
              <p>
                L&apos;utilisateur s&apos;engage à fournir des informations exactes lors de l&apos;inscription et à maintenir la confidentialité de ses identifiants.
              </p>
              <p>
                ITMade Studio se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.
              </p>
            </div>
          </section>

          {/* Article 3 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 3 - PROPRIÉTÉ INTELLECTUELLE
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                L&apos;ensemble des contenus de CODEBOG.DEV (exercices, textes, code, graphismes) sont protégés par le droit de la propriété intellectuelle.
              </p>
              <p>
                Les exercices sont destinés à un usage personnel et éducatif uniquement.
              </p>
              <p>
                Le code soumis par les utilisateurs reste leur propriété, mais ITMade Studio se réserve le droit de l&apos;utiliser à des fins d&apos;amélioration de la plateforme.
              </p>
            </div>
          </section>

          {/* Article 4 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 4 - OBLIGATIONS DE L&apos;UTILISATEUR
            </h2>
            <div className="text-green-300 space-y-2">
              <p>L&apos;utilisateur s&apos;engage à :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Utiliser la plateforme de manière conforme à sa destination</li>
                <li>Ne pas tenter de compromettre la sécurité du système</li>
                <li>Ne pas soumettre de code malveillant</li>
                <li>Respecter les autres utilisateurs</li>
                <li>Ne pas partager ses identifiants de connexion</li>
              </ul>
            </div>
          </section>

          {/* Article 5 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 5 - EXÉCUTION DE CODE
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                CODEBOG.DEV permet l&apos;exécution de code dans un environnement sandboxé. L&apos;utilisateur s&apos;engage à ne pas tenter de contourner les limitations de sécurité.
              </p>
              <p>
                ITMade Studio se réserve le droit de limiter ou bloquer l&apos;exécution de code jugé abusif ou malveillant.
              </p>
            </div>
          </section>

          {/* Article 6 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 6 - LIMITATION DE RESPONSABILITÉ
            </h2>
            <div className="text-green-300 space-y-4">
              <p>
                CODEBOG.DEV est fourni &quot;en l&apos;état&quot;. ITMade Studio ne garantit pas l&apos;absence d&apos;erreurs dans les exercices ou l&apos;exactitude pédagogique des contenus.
              </p>
              <p>
                ITMade Studio ne saurait être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation de la plateforme.
              </p>
            </div>
          </section>

          {/* Article 7 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 7 - DONNÉES PERSONNELLES
            </h2>
            <p className="text-green-300">
              Le traitement des données personnelles est détaillé dans notre{' '}
              <a href="/politique-confidentialite" className="text-[#2ecc71] hover:text-yellow-400 transition-colors underline">
                Politique de Confidentialité
              </a>.
            </p>
          </section>

          {/* Article 8 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 8 - MODIFICATIONS
            </h2>
            <p className="text-green-300">
              ITMade Studio se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications importantes. L&apos;utilisation continue du service vaut acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Article 9 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 9 - DROIT APPLICABLE
            </h2>
            <p className="text-green-300">
              Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux de Fort-de-France (Martinique) seront compétents.
            </p>
          </section>

          {/* Article 10 */}
          <section className="border-t-2 border-green-700 pt-6">
            <h2 className="text-2xl font-bold text-[#ffcc00] mb-4">
              &gt; ARTICLE 10 - CONTACT
            </h2>
            <p className="text-green-300">
              Pour toute question concernant ces CGU :{' '}
              <a href="mailto:contact@itmade.fr" className="text-[#2ecc71] hover:text-yellow-400 transition-colors">
                contact@itmade.fr
              </a>
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
