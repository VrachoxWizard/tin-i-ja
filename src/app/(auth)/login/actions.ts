'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Autentikacija nije uspjela')
  }

  // Determine dashboard based on user role
  let dashboardPath = '/dashboard/buyer'
  if (authData.user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profile?.role === 'seller') {
      dashboardPath = '/dashboard/seller'
    }
  }

  revalidatePath('/', 'layout')
  redirect(dashboardPath)
}
