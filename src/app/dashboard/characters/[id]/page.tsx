import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import CharacterStatusEditor from '@/components/characters/CharacterStatusEditor';
import AbilityScoresEditor from '@/components/characters/AbilityScoresEditor';
import SkillList from '@/components/characters/SkillList';
import DiceRoller from '@/components/dice/DiceRoller';
import DiceHistoryChart from '@/components/dice/DiceHistoryChart';
import SpellPanel from '@/components/magic/SpellPanel';
import CurrencyEditor from '@/components/characters/CurrencyEditor';

export const dynamic = 'force-dynamic';

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: character, error } = await supabase
    .from('characters')
    .select('*, ability_scores(*), character_status(*)')
    .eq('id', id)
    .single();

  if (error || !character || character.user_id !== user.id) notFound();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="container mx-auto p-4 md:p-8">
        <Link href="/dashboard" className="text-gold hover:underline">← Назад к списку</Link>
        <h1 className="text-3xl font-bold text-gold mt-2">{character.name}</h1>
        <p className="text-[var(--text-secondary)]">Уровень {character.level} – {character.race} {character.class}</p>
        <p className="text-sm text-[var(--text-secondary)]">Опыт: {character.experience}</p>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            {character.character_status && (
              <CharacterStatusEditor characterId={character.id} initialStatus={character.character_status} />
            )}
            {character.ability_scores && (
              <AbilityScoresEditor characterId={character.id} initialScores={character.ability_scores} />
            )}
            <CurrencyEditor characterId={character.id} initialGold={character.gold} initialSilver={character.silver} initialCopper={character.copper} />
          </div>
          <div className="space-y-6">
            <SkillList characterId={character.id} />
            <SpellPanel characterId={character.id} />
          </div>
          <div className="space-y-6">
            <DiceRoller characterId={character.id} />
            <DiceHistoryChart characterId={character.id} />
          </div>
        </div>
      </div>
    </div>
  );
}