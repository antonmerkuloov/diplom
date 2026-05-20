'use server'
import { createClient } from '@/lib/supabase/server'

export async function transferBetweenCharacters(
  fromCharId: string,
  toCharId: string,
  amount: number,
  currency: 'gold' | 'silver' | 'copper' | 'judacoins'
) {
  const supabase = await createClient()
  // Начинаем транзакцию (через RPC)
  const { error } = await supabase.rpc('transfer_currency', {
    from_char: fromCharId,
    to_char: toCharId,
    amount,
    currency_type: currency,
  })
  if (error) throw error
}