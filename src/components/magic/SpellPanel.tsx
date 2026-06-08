'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Spell = { id: string; name: string; circle: number; school: string; description: string; mana_cost: number };

export default function SpellPanel({ characterId }: { characterId: string }) {
  const [spells, setSpells] = useState<Spell[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('spells').select('*').eq('character_id', characterId).then(({ data }) => setSpells(data || []));
  }, [characterId]);

  if (spells.length === 0) return null;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gold mb-2">Заклинания</h2>
      <div className="space-y-2">
        {spells.map(spell => (
          <div key={spell.id} className="border-b border-[var(--border)] pb-2">
            <div className="font-bold">{spell.name} <span className="text-xs text-[var(--text-secondary)]">(круг {spell.circle}, {spell.school})</span></div>
            <p className="text-sm text-[var(--text-primary)]">{spell.description}</p>
            <div className="text-xs text-blue-500">Мана: {spell.mana_cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}