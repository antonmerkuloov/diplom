'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Buff = {
  id: string
  effect_name: string
  type: 'buff' | 'debuff'
  modifier: number
  duration: number | null
  expires_at: string | null
  affected_stat: string | null
}

export default function BuffList({ characterId }: { characterId: string }) {
  const [buffs, setBuffs] = useState<Buff[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchBuffs = async () => {
      const { data } = await supabase
        .from('buffs_debuffs')
        .select('*')
        .eq('character_id', characterId)
      setBuffs(data || [])
    }
    fetchBuffs()
  }, [characterId])

  const removeBuff = async (id: string) => {
    await supabase.from('buffs_debuffs').delete().eq('id', id)
    setBuffs(buffs.filter(b => b.id !== id))
  }

  return (
    <div className="bg-gray-800 p-2 rounded">
      <h3>Активные эффекты</h3>
      {buffs.map(b => (
        <div key={b.id} className={`flex justify-between ${b.type === 'buff' ? 'text-green-400' : 'text-red-400'}`}>
          <span>{b.effect_name} {b.modifier > 0 ? `+${b.modifier}` : b.modifier}</span>
          <button onClick={() => removeBuff(b.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}