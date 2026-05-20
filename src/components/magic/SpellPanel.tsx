'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Spell = {
  id: string;
  name: string;
  circle: number;
  school: string;
  description: string;
  mana_cost: number;
};

export default function SpellPanel({ characterId }: { characterId: string }) {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchSpells = async () => {
      const { data, error } = await supabase
        .from('spells')
        .select('*')
        .eq('character_id', characterId);
      if (!error && data) setSpells(data);
      setLoading(false);
    };
    fetchSpells();
  }, [characterId]);

  if (loading) return <div className="text-gray-400">Загрузка заклинаний...</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold">Заклинания</h2>
      {spells.length === 0 ? (
        <p className="text-gray-400 mt-2">Нет изученных заклинаний</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {spells.map(spell => (
            <li key={spell.id} className="border-b border-gray-700 pb-2">
              <div>
                <span className="font-bold">{spell.name}</span>
                <span className="text-xs text-gray-400 ml-2">(круг {spell.circle}, {spell.school})</span>
                <p className="text-sm text-gray-300">{spell.description}</p>
                <div className="text-xs text-blue-400">Стоимость маны: {spell.mana_cost}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}