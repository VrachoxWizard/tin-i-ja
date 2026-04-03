'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const rawEmail = formData.get('email')
  const parsed = z.string().email().safeParse(rawEmail)

  if (!parsed.success) {
    redirect('/forgot-password?error=invalid_email')
  }

  const email = parsed.data

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
  })

  if (error) {
    redirect('/forgot-password?error=email_send_failed')
  }

  redirect('/forgot-password?success=true')
}
