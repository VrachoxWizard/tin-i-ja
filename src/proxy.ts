import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy-session'

/**
 * Next.js 16 `proxy.ts` — replaces the legacy `middleware.ts`.
 *
 * Responsibilities:
 *  1. Refresh the Supabase session cookie on every request
 *  2. Guard protected routes and redirect unauthenticated users
 *  3. Inject security headers into every response
 */
export async function proxy(request: NextRequest) {
  // updateSession handles auth, role-based routing, AND security headers.
  // See src/lib/supabase/proxy-session.ts for full logic.
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Public assets (png, jpg, svg, webp, woff, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|mp4|webm|pdf)).*)',
  ],
}
