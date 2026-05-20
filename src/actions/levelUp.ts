'use server'
import { createClient } from '@/lib/supabase/server'

const XP_PER_LEVEL = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]

export async function addExperience(characterId: string, amount: number) {
  const supabase = await createClient()
  const { data: char } = await supabase
    .from('characters')
    .select('experience, level')
    .eq('id', characterId)
    .single()

  if (!char) return
  let newExp = char.experience + amount
  let newLevel = char.level

  while (newLevel < 20 && newExp >= XP_PER_LEVEL[newLevel]) {
    newExp -= XP_PER_LEVEL[newLevel]
    newLevel++
  }

  await supabase
    .from('characters')
    .update({ experience: newExp, level: newLevel })
    .eq('id', characterId)

  // При повышении уровня можно увеличить максимальное HP/MP
  if (newLevel > char.level) {
    // Добавляем 5 HP и 2 MP за уровень (пример)
    const { data: status } = await supabase
      .from('character_status')
      .select('max_hp, max_mp')
      .eq('character_id', characterId)
      .single()
    if (status) {
      await supabase
        .from('character_status')
        .update({
          max_hp: status.max_hp + 5,
          current_hp: status.max_hp + 5,
          max_mp: status.max_mp + 2,
          current_mp: status.max_mp + 2,
        })
        .eq('character_id', characterId)
    }
  }
}