'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Item = { id: string; item_name: string; quantity: number; equipped: boolean };

export default function InventoryList({ characterId }: { characterId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('character_id', characterId);
    if (error) console.error(error);
    else setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
  }, [characterId]);

  const add = async () => {
    if (!newName.trim()) return;
    setError('');
    const { error: insertError } = await supabase
      .from('inventory')
      .insert({ character_id: characterId, item_name: newName.trim(), quantity: 1 });
    if (insertError) {
      console.error(insertError);
      setError('Ошибка: ' + insertError.message);
    } else {
      setNewName('');
      fetchItems();
      router.refresh();
    }
  };

  const remove = async (id: string) => {
    await supabase.from('inventory').delete().eq('id', id);
    fetchItems();
    router.refresh();
  };

  const toggle = async (id: string, equipped: boolean) => {
    await supabase.from('inventory').update({ equipped: !equipped }).eq('id', id);
    fetchItems();
    router.refresh();
  };

  return (
    <div className="bg-[var(--bg-card)]-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold">Инвентарь</h2>
      {error && <div className="text-red-400 text-sm mt-1">{error}</div>}
      <div className="flex gap-2 mt-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Название предмета"
          className="flex-1 p-1 bg-[var(--bg-card)]-700 rounded"
        />
        <button onClick={add} className="bg-gold text-black px-3 py-1 rounded">+</button>
      </div>
      {items.length === 0 ? (
        <p className="text-[var(--text-secondary)] mt-2">Инвентарь пуст</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.map(item => (
            <li key={item.id} className="flex justify-between items-center">
              <span>{item.item_name} (x{item.quantity})</span>
              <div>
                <button onClick={() => toggle(item.id, item.equipped)} className={`text-xs px-2 rounded ${item.equipped ? 'bg-gold text-black' : 'bg-[var(--bg-card)]-600'}`}>
                  {item.equipped ? 'Экип' : 'Снять'}
                </button>
                <button onClick={() => remove(item.id)} className="ml-2 text-red-400">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}