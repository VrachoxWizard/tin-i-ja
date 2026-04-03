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
    redirect('/login?error=auth_failed')
  }

  // Determine dashboard based on user role
  let dashboardPath = '/dashboard/buyer'
  if (authData.user) {
    const { data: profileData } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileData?.role === 'admin') {
      dashboardPath = '/dashboard/admin'
    } else if (profileData?.role === 'seller') {
      dashboardPath = '/dashboard/seller'
    }
  }

  revalidatePath('/', 'layout')
  redirect(dashboardPath)
}
