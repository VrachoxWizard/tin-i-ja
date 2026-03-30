'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password !== confirmPassword) {
    redirect('/update-password?error=Lozinke se ne podudaraju')
  }

  if (password.length < 6) {
    redirect('/update-password?error=Lozinka mora imati najmanje 6 znakova')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/update-password?error=Ažuriranje lozinke nije uspjelo. Pokušajte ponovo.')
  }

  redirect('/login?message=Lozinka uspješno ažurirana. Prijavite se.')
}
