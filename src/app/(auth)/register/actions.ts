'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validatePassword } from '@/lib/password-validation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const role = (formData.get('role') as string) || 'buyer'
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

  const dashboardPath = role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'

  revalidatePath('/', 'layout')
  redirect(dashboardPath)
}
