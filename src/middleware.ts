// src/middleware.ts
import type { NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Met à jour la session de l'utilisateur en utilisant le helper
  // Supabase pour le middleware.
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Fait correspondre tous les chemins de requête, à l'exception de ceux qui commencent par :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (fichier favicon)
     * L'objectif est d'exécuter le middleware sur toutes les routes
     * qui servent du contenu dynamique ou des pages.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
