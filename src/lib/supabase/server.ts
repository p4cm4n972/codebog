// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  // Créez un client Supabase pour le serveur en utilisant les informations
  // d'identification de votre projet, stockées dans des variables d'environnement.
  //
  // IMPORTANT : Assurez-vous que les variables d'environnement suivantes sont bien
  // configurées dans votre projet (par exemple, dans un fichier .env.local) :
  //
  // NEXT_PUBLIC_SUPABASE_URL=VOTRE_URL_SUPABASE
  // NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_PUBLIQUE
  // SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE (si nécessaire pour des opérations admin)
  //
  // Ce client est conçu pour être utilisé dans des contextes côté serveur (Server Components,
  // Route Handlers, Server Actions). Il lit et écrit les cookies nécessaires à l'authentification.

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (_error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (_error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
