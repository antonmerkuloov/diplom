import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: characters, error } = await supabase
    .from('characters')
    .select('id, name, race, class, level')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Ошибка загрузки персонажей:', error)
    return <div className="text-red-500 p-8">Ошибка загрузки персонажей</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gold mb-2">Мои персонажи</h1>
        <p className="text-gray-400 mb-6">Управляйте своими героями D&D</p>

        <Link
          href="/dashboard/characters/new"
          className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition"
        >
          + Создать персонажа
        </Link>

        {characters && characters.length > 0 ? (
          <div className="mt-6 grid gap-3">
            {characters.map((char) => (
              <Link key={char.id} href={`/dashboard/characters/${char.id}`}>
                <div className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-700 transition flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{char.name}</h2>
                    <p className="text-gray-400 text-sm">
                      Уровень {char.level} – {char.race} {char.class}
                    </p>
                  </div>
                  <span className="text-gold">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-400">У вас пока нет персонажей.</p>
            <Link href="/dashboard/characters/new" className="text-gold hover:underline mt-2 inline-block">
              Создайте первого персонажа
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}