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
    const { error } = await supabase
      .from('characters')
      .update({ gold, silver, copper })
      .eq('id', characterId);
    if (error) setMessage('Ошибка сохранения');
    else {
      setMessage('Сохранено');
      router.refresh();
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold mb-2">Сокровища</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm text-gray-300">🟡 Золото</label>
          <input
            type="number"
            value={gold}
            onChange={(e) => setGold(Number(e.target.value))}
            className="w-full bg-gray-700 p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">⚪ Серебро</label>
          <input
            type="number"
            value={silver}
            onChange={(e) => setSilver(Number(e.target.value))}
            className="w-full bg-gray-700 p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">🟤 Медь</label>
          <input
            type="number"
            value={copper}
            onChange={(e) => setCopper(Number(e.target.value))}
            className="w-full bg-gray-700 p-1 rounded"
          />
        </div>
        <button type="submit" className="col-span-3 bg-gold text-black p-1 rounded mt-2">
          Сохранить
        </button>
      </form>
      {message && <div className="text-green-400 text-sm mt-1">{message}</div>}
    </div>
  );
}