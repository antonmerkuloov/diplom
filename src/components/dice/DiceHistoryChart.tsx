'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Roll = { id: string; dice_type: string; result: number; modifier: number; total: number; skill_name: string | null; timestamp: string };

export default function DiceHistoryChart({ characterId }: { characterId: string }) {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const supabase = createClient();

  const fetchRolls = async () => {
    const { data } = await supabase
      .from('dice_rolls')
      .select('*')
      .eq('character_id', characterId)
      .order('timestamp', { ascending: false })
      .limit(20);
    if (data) setRolls(data);
  };

  useEffect(() => {
    fetchRolls();
  }, [characterId]);

  if (rolls.length === 0) return null;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gold">История бросков</h3>
        <button onClick={fetchRolls} className="text-xs bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded border border-[var(--border)]">Обновить</button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[var(--bg-card)]">
            <tr className="text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="text-left">Кубик</th><th>Результат</th><th>Мод.</th><th>Итого</th><th>Навык</th>
            </tr>
          </thead>
          <tbody>
            {rolls.map(roll => (
              <tr key={roll.id} className="border-b border-[var(--border)]">
                <td>{roll.dice_type}</td>
                <td className="text-center">{roll.result}</td>
                <td className="text-center">{roll.modifier}</td>
                <td className="text-center font-bold">{roll.total}</td>
                <td className="text-xs text-[var(--text-secondary)]">{roll.skill_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}