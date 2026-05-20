import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSpells from '@/components/admin/AdminSpells'
import AdminSkills from '@/components/admin/AdminSkills'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gold mb-6">Административная панель</h1>
      <AdminSpells />
      <AdminSkills />
    </div>
  )
}