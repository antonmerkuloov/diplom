'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Spell = {
  id: string
  name: string
  circle: number
  school: string | null
  range: string | null
  components: string | null
  duration: string | null
  damage: string | null
  mana_cost: number
  stamina_cost: number
  threshold: number | null
  description: string | null
}

export default function AdminSpells() {
  const [spells, setSpells] = useState<Spell[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  // Загрузка списка заклинаний
  useEffect(() => {
    fetchSpells()
  }, [])

  async function fetchSpells() {
    setLoading(true)
    const { data, error } = await supabase
      .from('spells')
      .select('*')
      .order('circle', { ascending: true })
      .order('name')
    if (error) {
      console.error(error)
      setMessage('Ошибка загрузки заклинаний')
    } else {
      setSpells(data || [])
    }
    setLoading(false)
  }

  // Добавление заклинания
  async function addSpell(formData: FormData) {
    const name = formData.get('name') as string
    const circle = parseInt(formData.get('circle') as string) || 1
    const mana_cost = parseInt(formData.get('mana_cost') as string) || 0
    const stamina_cost = parseInt(formData.get('stamina_cost') as string) || 0
    const threshold = formData.get('threshold') ? parseInt(formData.get('threshold') as string) : null
    const description = (formData.get('description') as string) || null

    const { error } = await supabase.from('spells').insert({
      name,
      circle,
      mana_cost,
      stamina_cost,
      threshold,
      description,
    })

    if (error) {
      setMessage('Ошибка: ' + error.message)
    } else {
      setMessage(`Заклинание "${name}" добавлено`)
      fetchSpells() // обновить список
    }
  }

  // Удаление заклинания
  async function deleteSpell(id: string, name: string) {
    if (!confirm(`Удалить заклинание "${name}"?`)) return
    const { error } = await supabase.from('spells').delete().eq('id', id)
    if (error) {
      setMessage('Ошибка удаления: ' + error.message)
    } else {
      setMessage(`Заклинание "${name}" удалено`)
      fetchSpells()
    }
  }

  if (loading) return <div className="text-gray-400">Загрузка заклинаний...</div>

  return (
    <div className="bg-gray-800 p-4 rounded-lg my-4">
      <h2 className="text-xl font-semibold text-gold mb-4">Управление заклинаниями</h2>

      {message && <div className="mb-2 text-sm text-green-400">{message}</div>}

      {/* Форма добавления */}
      <form action={addSpell} className="grid md:grid-cols-3 gap-3 p-3 bg-gray-700 rounded mb-4">
        <input name="name" placeholder="Название заклинания" required className="bg-gray-600 px-2 py-1 rounded" />
        <input name="circle" type="number" placeholder="Круг (1-5)" min="1" max="5" defaultValue="1" className="bg-gray-600 px-2 py-1 rounded" />
        <input name="mana_cost" type="number" placeholder="Стоимость маны" defaultValue="0" className="bg-gray-600 px-2 py-1 rounded" />
        <input name="stamina_cost" type="number" placeholder="Стоимость выносливости" defaultValue="0" className="bg-gray-600 px-2 py-1 rounded" />
        <input name="threshold" type="number" placeholder="Порог (опционально)" className="bg-gray-600 px-2 py-1 rounded" />
        <input name="description" placeholder="Описание" className="bg-gray-600 px-2 py-1 rounded" />
        <button type="submit" className="bg-gold text-black px-3 py-1 rounded col-span-3 md:col-span-1">Добавить заклинание</button>
      </form>

      {/* Список заклинаний */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Название</th>
              <th className="p-2">Круг</th>
              <th className="p-2">Мана</th>
              <th className="p-2">Вын.</th>
              <th className="p-2">Порог</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {spells.map((spell) => (
              <tr key={spell.id} className="border-t border-gray-700">
                <td className="p-2">{spell.name}</td>
                <td className="p-2 text-center">{spell.circle}</td>
                <td className="p-2 text-center">{spell.mana_cost}</td>
                <td className="p-2 text-center">{spell.stamina_cost}</td>
                <td className="p-2 text-center">{spell.threshold ?? '-'}</td>
                <td className="p-2 text-center">
                  <button onClick={() => deleteSpell(spell.id, spell.name)} className="text-red-400 hover:text-red-300">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}