import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getFanAuth } from '../actions/get-fan-auth'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const response = await getFanAuth(user.id)
  
  if (!response.success) redirect("/choose-username")

  return <>{children}</>
}
