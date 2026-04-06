'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardPathForRole } from '@/lib/contracts'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=auth_failed')
  }

  let dashboardPath = getDashboardPathForRole(null)
  if (authData.user) {
    const { data: profileData } = await supabase
      .from('users')
      .select('role, suspended_at')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileData?.suspended_at) {
      await supabase.auth.signOut()
      redirect('/login?error=account_suspended')
    }

    dashboardPath = getDashboardPathForRole(profileData?.role)
  }

  revalidatePath('/', 'layout')
  redirect(dashboardPath)
}
