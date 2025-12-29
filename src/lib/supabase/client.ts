// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Créez un client Supabase pour le navigateur en utilisant les informations
  // d'identification de votre projet, stockées dans des variables d'environnement.
  //
  // IMPORTANT : Assurez-vous de créer un fichier .env.local à la racine de votre projet
  // et d'y ajouter les variables suivantes :
  //
  // NEXT_PUBLIC_SUPABASE_URL=VOTRE_URL_SUPABASE
  // NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_PUBLIQUE
  //
  // Remplacez VOTRE_URL_SUPABASE et VOTRE_CLE_ANON_PUBLIQUE par les valeurs
  // correspondantes que vous trouverez dans les paramètres de votre projet Supabase.

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
