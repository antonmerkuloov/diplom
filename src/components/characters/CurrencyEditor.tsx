'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CurrencyEditor({ characterId, initialGold, initialSilver, initialCopper }: any) {
  const [gold, setGold] = useState(initialGold);
  const [silver, setSilver] = useState(initialSilver);
  const [copper, setCopper] = useState(initialCopper);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('characters').update({ gold, silver, copper }).eq('id', characterId);
    if (error) setMessage('Ошибка');
    else {
      setMessage('Сохранено');
      router.refresh();
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gold mb-2">Сокровища</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
        <div><label className="block text-sm text-[var(--text-secondary)]">🟡 Золото</label><input type="number" value={gold} onChange={e => setGold(+e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" /></div>
        <div><label className="block text-sm text-[var(--text-secondary)]">⚪ Серебро</label><input type="number" value={silver} onChange={e => setSilver(+e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" /></div>
        <div><label className="block text-sm text-[var(--text-secondary)]">🟤 Медь</label><input type="number" value={copper} onChange={e => setCopper(+e.target.value)} className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded" /></div>
        <button type="submit" className="col-span-3 bg-gold text-black font-bold py-2 rounded hover:bg-yellow-600 transition">Сохранить</button>
      </form>
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
    </div>
  );
}