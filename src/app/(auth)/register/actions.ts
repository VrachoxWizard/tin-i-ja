'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validatePassword } from '@/lib/password-validation'
import {
  getDashboardPathForRole,
  normalizeSelfSignupRole,
} from '@/lib/contracts'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const role = normalizeSelfSignupRole(formData.get('role') as string | null)
  const password = formData.get('password') as string

  const passwordError = validatePassword(password)
  if (passwordError) {
    redirect(`/register?error=${passwordError}`)
  }

  const data = {
    email: formData.get('email') as string,
    password,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        role,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/register?error=signup_failed')
  }

  revalidatePath('/', 'layout')
  redirect(getDashboardPathForRole(role))
}
