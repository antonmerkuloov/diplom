import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default function NewCharacterPage() {
  async function createCharacter(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const name = formData.get('name') as string
    const race = formData.get('race') as string      // будет приходить русское значение
    const classType = formData.get('class') as string
    const level = Number(formData.get('level')) || 1

    // При сохранении в БД лучше хранить английские ключи, но для простоты сохраняем русские
    // (можно позже добавить маппинг, но пока пусть будет русский текст)
    const { data: character, error } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name,
        race,
        class: classType,
        level,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      redirect('/dashboard/characters/new?error=failed')
    }
    redirect(`/dashboard/characters/${character.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gold mb-6 text-center">Создание персонажа</h1>
        <form action={createCharacter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Имя</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Раса</label>
            <select
              name="race"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="Человек">Человек</option>
              <option value="Эльф">Эльф</option>
              <option value="Дварф">Дварф</option>
              <option value="Полурослик">Полурослик</option>
              <option value="Драконорождённый">Драконорождённый</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Класс</label>
            <select
              name="class"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="Воин">Воин</option>
              <option value="Плут">Плут</option>
              <option value="Маг">Маг</option>
              <option value="Жрец">Жрец</option>
              <option value="Следопыт">Следопыт</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Уровень</label>
            <input
              name="level"
              type="number"
              min="1"
              max="20"
              defaultValue="1"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition mt-2"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  )
}