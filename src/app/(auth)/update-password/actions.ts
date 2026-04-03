'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validatePassword } from '@/lib/password-validation'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password !== confirmPassword) {
    redirect('/update-password?error=password_mismatch')
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    redirect(`/update-password?error=${passwordError}`)
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/update-password?error=password_update_failed')
  }

  redirect('/login?message=Lozinka uspješno ažurirana. Prijavite se.')
}
