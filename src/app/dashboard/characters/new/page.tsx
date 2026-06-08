import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function NewCharacterPage() {
  async function createCharacter(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const name = formData.get('name') as string;
    const race = formData.get('race') as string;
    const classType = formData.get('class') as string;
    const level = Number(formData.get('level')) || 1;

    const { data: character, error } = await supabase
      .from('characters')
      .insert({ user_id: user.id, name, race, class: classType, level })
      .select()
      .single();

    if (error) redirect('/dashboard/characters/new?error=failed');
    redirect(`/dashboard/characters/${character.id}`);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-card)]k dark:bg-white text-[var(--text-primary)] dark:text-black p-8">
      <div className="max-w-md mx-auto bg-[var(--bg-card)]-900 dark:bg-[var(--bg-card)]-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gold dark:text-black mb-4 text-center">Создание персонажа</h1>
        <form action={createCharacter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] dark:text-gray-700 mb-1">Имя</label>
            <input name="name" required className="w-full px-3 py-2 bg-[var(--bg-card)]-800 dark:bg-[var(--bg-card)]-200 border border-[var(--border)]-600 dark:border-[var(--border)]-400 rounded-md text-[var(--text-primary)] dark:text-black focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] dark:text-gray-700 mb-1">Раса</label>
            <select name="race" className="w-full px-3 py-2 bg-[var(--bg-card)]-800 dark:bg-[var(--bg-card)]-200 border border-[var(--border)]-600 dark:border-[var(--border)]-400 rounded-md text-[var(--text-primary)] dark:text-black">
              <option>Человек</option><option>Эльф</option><option>Дварф</option><option>Полурослик</option><option>Драконорождённый</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] dark:text-gray-700 mb-1">Класс</label>
            <select name="class" className="w-full px-3 py-2 bg-[var(--bg-card)]-800 dark:bg-[var(--bg-card)]-200 border border-[var(--border)]-600 dark:border-[var(--border)]-400 rounded-md text-[var(--text-primary)] dark:text-black">
              <option>Воин</option><option>Плут</option><option>Маг</option><option>Жрец</option><option>Следопыт</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] dark:text-gray-700 mb-1">Уровень</label>
            <input name="level" type="number" min="1" max="20" defaultValue="1" className="w-full px-3 py-2 bg-[var(--bg-card)]-800 dark:bg-[var(--bg-card)]-200 border border-[var(--border)]-600 dark:border-[var(--border)]-400 rounded-md text-[var(--text-primary)] dark:text-black" />
          </div>
          <button type="submit" className="w-full bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition mt-2">
            Создать
          </button>
        </form>
      </div>
    </div>
  );
}