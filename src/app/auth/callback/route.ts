import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/** Only allow relative paths starting with a single slash to prevent open redirects. */
function sanitizeNextPath(next: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next
  }
  return '/dashboard/buyer'
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeNextPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth code exchange failed — redirect to error page
  return NextResponse.redirect(`${origin}/login?error=Autentikacija nije uspjela`)
}
