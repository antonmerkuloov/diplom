'use server'
import { createClient } from '@/lib/supabase/server'

export async function getActiveBuffs(characterId: string) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('buffs_debuffs')
    .select('*')
    .eq('character_id', characterId)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
  return data || []
}

export async function applyBuff(
  characterId: string,
  effectName: string,
  type: 'buff' | 'debuff',
  modifier: number,
  duration: number | null,
  affectedStat: string | null
) {
  const supabase = await createClient()
  const expiresAt = duration ? new Date(Date.now() + duration * 60000) : null // duration в минутах
  await supabase.from('buffs_debuffs').insert({
    character_id: characterId,
    effect_name: effectName,
    type,
    modifier,
    duration,
    expires_at: expiresAt,
    affected_stat: affectedStat,
  })
}

export async function removeBuff(buffId: string) {
  const supabase = await createClient()
  await supabase.from('buffs_debuffs').delete().eq('id', buffId)
}