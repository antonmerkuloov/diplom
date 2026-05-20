'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function QuickStatusButtons({ characterId, currentHp, currentMp }: any) {
  const router = useRouter();
  const supabase = createClient();

  const modify = async (field: 'hp' | 'mp', delta: number) => {
    const update = field === 'hp'
      ? { current_hp: Math.max(0, currentHp + delta) }
      : { current_mp: Math.max(0, currentMp + delta) };
    const { error } = await supabase
      .from('character_status')
      .update(update)
      .eq('character_id', characterId);
    if (!error) {
      router.refresh(); // обновляет данные на странице без перезагрузки
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <button onClick={() => modify('hp', -1)} className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm font-bold">-1 HP</button>
      <button onClick={() => modify('hp', 1)} className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-sm font-bold">+1 HP</button>
      <button onClick={() => modify('mp', -1)} className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm font-bold">-1 MP</button>
      <button onClick={() => modify('mp', 1)} className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm font-bold">+1 MP</button>
    </div>
  );
}