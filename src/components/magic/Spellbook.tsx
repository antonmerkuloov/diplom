'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Spell = {
  id: string
  name: string
  circle: number
  mana_cost: number
  stamina_cost: number
  threshold: number
  description: string
}

type CharacterSpell = {
  spell_id: string
  prepared: boolean
  spell: Spell
}

type SpellSlot = {
  circle: number
  used_slots: number
  total_slots: number
}

export default function Spellbook({ characterId }: { characterId: string }) {
  const [spells, setSpells] = useState<CharacterSpell[]>([])
  const [slots, setSlots] = useState<SpellSlot[]>([])
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [characterId])

  async function fetchData() {
    // Изученные заклинания
    const { data: charSpells } = await supabase
      .from('character_spells')
      .select('*, spell:spells(*)')
      .eq('character_id', characterId)
    
    // Слоты
    const { data: slotData } = await supabase
      .from('spell_slots')
      .select('*')
      .eq('character_id', characterId)
    
    // Все доступные заклинания (для добавления)
    const { data: allSpells } = await supabase
      .from('spells')
      .select('*')
      .order('circle')
    
    if (charSpells) setSpells(charSpells)
    if (slotData) setSlots(slotData)
    if (allSpells) setAvailableSpells(allSpells)
  }

  async function learnSpell(spellId: string) {
    await supabase.from('character_spells').insert({
      character_id: characterId,
      spell_id: spellId,
      prepared: false
    })
    fetchData()
  }

  async function togglePrepare(spellId: string, currentPrepared: boolean) {
    await supabase
      .from('character_spells')
      .update({ prepared: !currentPrepared })
      .eq('character_id', characterId)
      .eq('spell_id', spellId)
    fetchData()
  }

  async function castSpell(spell: Spell) {
    // Проверка слотов
    const slot = slots.find(s => s.circle === spell.circle)
    if (!slot || slot.used_slots >= slot.total_slots) {
      alert('Нет свободных слотов для этого круга')
      return
    }
    // Проверка маны/выносливости (позже)
    // Обновляем использованные слоты
    await supabase
      .from('spell_slots')
      .update({ used_slots: slot.used_slots + 1 })
      .eq('character_id', characterId)
      .eq('circle', spell.circle)
    fetchData()
    // Здесь можно добавить логику бросков кубиков
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-6">
      <h2 className="text-xl font-semibold text-gold">Заклинания</h2>
      <div className="flex flex-wrap gap-2 my-2">
        {slots.map(s => (
          <span key={s.circle} className="bg-gray-700 px-2 py-1 rounded">
            {s.circle} круг: {s.used_slots}/{s.total_slots}
          </span>
        ))}
      </div>
      <div>
        <h3>Изученные</h3>
        {spells.map(cs => (
          <div key={cs.spell_id} className="border p-2 my-1">
            <div className="flex justify-between">
              <span>{cs.spell.name} (круг {cs.spell.circle})</span>
              <button onClick={() => togglePrepare(cs.spell_id, cs.prepared)}>
                {cs.prepared ? 'Подготовлено' : 'Не подготовлено'}
              </button>
              {cs.prepared && (
                <button onClick={() => castSpell(cs.spell)}>Применить</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <details>
        <summary>Изучить новое заклинание</summary>
        <select onChange={(e) => learnSpell(e.target.value)}>
          <option value="">Выберите заклинание</option>
          {availableSpells.map(s => (
            <option key={s.id} value={s.id}>{s.name} (круг {s.circle})</option>
          ))}
        </select>
      </details>
    </div>
  )
}