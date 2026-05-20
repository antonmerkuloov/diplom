'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type GlobalSkill = {
  id: string
  name: string
  ability_score: string
  description: string | null
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<GlobalSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    setLoading(true)
    const { data, error } = await supabase
      .from('all_skills')
      .select('*')
      .order('name')
    if (error) {
      console.error(error)
      setMessage('Ошибка загрузки навыков')
    } else {
      setSkills(data || [])
    }
    setLoading(false)
  }

  async function addSkill(formData: FormData) {
    const name = formData.get('name') as string
    const ability_score = formData.get('ability_score') as string
    const description = (formData.get('description') as string) || null

    const { error } = await supabase.from('all_skills').insert({
      name,
      ability_score,
      description,
    })

    if (error) {
      setMessage('Ошибка: ' + error.message)
    } else {
      setMessage(`Навык "${name}" добавлен`)
      fetchSkills()
    }
  }

  async function deleteSkill(id: string, name: string) {
    if (!confirm(`Удалить навык "${name}"?`)) return
    const { error } = await supabase.from('all_skills').delete().eq('id', id)
    if (error) {
      setMessage('Ошибка удаления: ' + error.message)
    } else {
      setMessage(`Навык "${name}" удалён`)
      fetchSkills()
    }
  }

  if (loading) return <div className="text-gray-400">Загрузка навыков...</div>

  return (
    <div className="bg-gray-800 p-4 rounded-lg my-4">
      <h2 className="text-xl font-semibold text-gold mb-4">Управление глобальными навыками</h2>

      {message && <div className="mb-2 text-sm text-green-400">{message}</div>}

      <form action={addSkill} className="grid md:grid-cols-3 gap-3 p-3 bg-gray-700 rounded mb-4">
        <input name="name" placeholder="Название навыка (англ)" required className="bg-gray-600 px-2 py-1 rounded" />
        <select name="ability_score" required className="bg-gray-600 px-2 py-1 rounded">
          <option value="strength">Сила (strength)</option>
          <option value="dexterity">Ловкость (dexterity)</option>
          <option value="constitution">Телосложение (constitution)</option>
          <option value="intelligence">Интеллект (intelligence)</option>
          <option value="wisdom">Мудрость (wisdom)</option>
          <option value="charisma">Харизма (charisma)</option>
        </select>
        <input name="description" placeholder="Описание" className="bg-gray-600 px-2 py-1 rounded" />
        <button type="submit" className="bg-gold text-black px-3 py-1 rounded col-span-3 md:col-span-1">Добавить навык</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Название</th>
              <th className="p-2">Характеристика</th>
              <th className="p-2">Описание</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-t border-gray-700">
                <td className="p-2">{skill.name}</td>
                <td className="p-2">{skill.ability_score}</td>
                <td className="p-2">{skill.description || '-'}</td>
                <td className="p-2 text-center">
                  <button onClick={() => deleteSkill(skill.id, skill.name)} className="text-red-400 hover:text-red-300">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}