'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CharacterStatusEditor({ characterId, initialStatus }: any) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('character_status')
      .update(status)
      .eq('character_id', characterId);
    if (error) setMessage('Ошибка сохранения');
    else {
      setMessage('Сохранено');
      router.refresh();
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gold mb-2">Статус</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Текущее HP</label>
          <input
            type="number"
            value={status.current_hp}
            onChange={(e) => setStatus({ ...status, current_hp: +e.target.value })}
            className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Макс. HP</label>
          <input
            type="number"
            value={status.max_hp}
            onChange={(e) => setStatus({ ...status, max_hp: +e.target.value })}
            className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Текущая MP</label>
          <input
            type="number"
            value={status.current_mp}
            onChange={(e) => setStatus({ ...status, current_mp: +e.target.value })}
            className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Макс. MP</label>
          <input
            type="number"
            value={status.max_mp}
            onChange={(e) => setStatus({ ...status, max_mp: +e.target.value })}
            className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Класс брони</label>
          <input
            type="number"
            value={status.armor_class}
            onChange={(e) => setStatus({ ...status, armor_class: +e.target.value })}
            className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)]">Выносливость</label>
          <input
            type="number"
            value={status.stamina}
            onChange={(e) => setStatus({ ...status, stamina: +e.target.value })}
            className="w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] rounded"
          />
        </div>
        <button type="submit" className="col-span-2 bg-gold text-black font-bold py-2 rounded hover:bg-yellow-600 transition">
          Сохранить
        </button>
      </form>
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
    </div>
  );
}