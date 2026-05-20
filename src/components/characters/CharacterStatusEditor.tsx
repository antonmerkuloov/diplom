'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CharacterStatusEditor({ characterId, initialStatus }: any) {
  const [status, setStatus] = useState(initialStatus);
  const [msg, setMsg] = useState('');
  const supabase = createClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('character_status').update(status).eq('character_id', characterId);
    setMsg(error ? 'Ошибка' : 'Сохранено');
    setTimeout(() => setMsg(''), 2000);
  };
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold">Статус</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mt-2">
        <div><label>Текущее HP</label><input type="number" value={status.current_hp} onChange={e => setStatus({ ...status, current_hp: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <div><label>Макс. HP</label><input type="number" value={status.max_hp} onChange={e => setStatus({ ...status, max_hp: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <div><label>Текущая MP</label><input type="number" value={status.current_mp} onChange={e => setStatus({ ...status, current_mp: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <div><label>Макс. MP</label><input type="number" value={status.max_mp} onChange={e => setStatus({ ...status, max_mp: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <div><label>Класс брони</label><input type="number" value={status.armor_class} onChange={e => setStatus({ ...status, armor_class: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <div><label>Выносливость</label><input type="number" value={status.stamina} onChange={e => setStatus({ ...status, stamina: +e.target.value })} className="w-full bg-gray-700 p-1 rounded" /></div>
        <button type="submit" className="col-span-2 bg-gold text-black p-1 rounded">Сохранить</button>
      </form>
      {msg && <div className="text-green-400 text-sm mt-1">{msg}</div>}
    </div>
  );
}