'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const getMod = (s: number) => Math.floor((s - 10) / 2);

export default function AbilityScoresEditor({ characterId, initialScores }: any) {
  const [scores, setScores] = useState(initialScores);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('ability_scores')
      .update(scores)
      .eq('character_id', characterId);
    if (error) setMessage('Ошибка сохранения');
    else {
      setMessage('Сохранено');
      router.refresh();
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const updateScore = (field: string, value: number) => {
    setScores({ ...scores, [field]: Math.max(1, value) });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gold mb-2">Характеристики</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Сила</label>
          <input type="number" value={scores.strength} onChange={e => updateScore('strength', +e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
          <div className="text-xs text-[var(--text-secondary)]">мод {getMod(scores.strength)}</div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Ловкость</label>
          <input type="number" value={scores.dexterity} onChange={e => updateScore('dexterity', +e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
          <div className="text-xs text-[var(--text-secondary)]">мод {getMod(scores.dexterity)}</div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Телосложение</label>
          <input type="number" value={scores.constitution} onChange={e => updateScore('constitution', +e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
          <div className="text-xs text-[var(--text-secondary)]">мод {getMod(scores.constitution)}</div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Интеллект</label>
          <input type="number" value={scores.intelligence} onChange={e => updateScore('intelligence', +e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
          <div className="text-xs text-[var(--text-secondary)]">мод {getMod(scores.intelligence)}</div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Мудрость</label>
          <input type="number" value={scores.wisdom} onChange={e => updateScore('wisdom', +e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
          <div className="text-xs text-[var(--text-secondary)]">мод {getMod(scores.wisdom)}</div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Харизма</label>
          <input type="number" value={scores.charisma} onChange={e => updateScore('charisma', +e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
          <div className="text-xs text-[var(--text-secondary)]">мод {getMod(scores.charisma)}</div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-[var(--text-secondary)]">Бонус мастерства</label>
          <input type="number" value={scores.proficiency_bonus} onChange={e => setScores({ ...scores, proficiency_bonus: +e.target.value })} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" />
        </div>
        <button type="submit" className="col-span-2 bg-gold text-black font-bold py-2 rounded hover:bg-yellow-600 transition">
          Сохранить
        </button>
      </form>
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
    </div>
  );
}