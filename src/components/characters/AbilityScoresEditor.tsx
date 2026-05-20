'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const getMod = (s: number) => Math.floor((s - 10) / 2);

export default function AbilityScoresEditor({ characterId, initialScores }: any) {
  const [scores, setScores] = useState(initialScores);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const updateScore = (field: string, value: number) => {
    const newValue = Math.max(1, value); // минимум 1
    setScores({ ...scores, [field]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');
    const { error: updateError } = await supabase
      .from('ability_scores')
      .update(scores)
      .eq('character_id', characterId);

    if (updateError) {
      setError('Ошибка: ' + updateError.message);
    } else {
      setMsg('Сохранено');
      router.refresh();
    }
    setTimeout(() => {
      setMsg('');
      setError('');
    }, 2000);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold">Характеристики</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mt-2">
        <div>Сила <input type="number" min="1" value={scores.strength} onChange={e => updateScore('strength', +e.target.value)} className="w-full bg-gray-700 p-1 rounded" /> мод {getMod(scores.strength)}</div>
        <div>Ловкость <input type="number" min="1" value={scores.dexterity} onChange={e => updateScore('dexterity', +e.target.value)} className="w-full bg-gray-700 p-1 rounded" /> мод {getMod(scores.dexterity)}</div>
        <div>Телосложение <input type="number" min="1" value={scores.constitution} onChange={e => updateScore('constitution', +e.target.value)} className="w-full bg-gray-700 p-1 rounded" /> мод {getMod(scores.constitution)}</div>
        <div>Интеллект <input type="number" min="1" value={scores.intelligence} onChange={e => updateScore('intelligence', +e.target.value)} className="w-full bg-gray-700 p-1 rounded" /> мод {getMod(scores.intelligence)}</div>
        <div>Мудрость <input type="number" min="1" value={scores.wisdom} onChange={e => updateScore('wisdom', +e.target.value)} className="w-full bg-gray-700 p-1 rounded" /> мод {getMod(scores.wisdom)}</div>
        <div>Харизма <input type="number" min="1" value={scores.charisma} onChange={e => updateScore('charisma', +e.target.value)} className="w-full bg-gray-700 p-1 rounded" /> мод {getMod(scores.charisma)}</div>
        <div className="col-span-2">Бонус мастерства <input type="number" min="0" value={scores.proficiency_bonus} onChange={e => setScores({ ...scores, proficiency_bonus: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <button type="submit" className="col-span-2 bg-gold text-black p-1 rounded">Сохранить</button>
      </form>
      {error && <div className="text-red-400 text-sm mt-1">{error}</div>}
      {msg && <div className="text-green-400 text-sm mt-1">{msg}</div>}
    </div>
  );
}