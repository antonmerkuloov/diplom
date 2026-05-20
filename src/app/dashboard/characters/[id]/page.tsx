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
type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  experience: number;
  gold: number;
  silver: number;
  copper: number;
  ability_scores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    proficiency_bonus: number;
  } | null;
  character_status: {
    current_hp: number;
    max_hp: number;
    current_mp: number;
    max_mp: number;
    armor_class: number;
    stamina: number;
  } | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: character, error } = await supabase
    .from('characters')
    .select(`
      *,
      ability_scores (*),
      character_status (*)
    `)
    .eq('id', id)
    .single();

  if (error || !character || character.user_id !== user.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 md:p-8">
        {/* Навигация */}
        <div className="mb-4">
          <Link href="/dashboard" className="text-gold hover:underline">
            ← Назад к списку персонажей
          </Link>
        </div>

        {/* Заголовок (без валюты) */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gold">{character.name}</h1>
          <p className="text-gray-400">
            Уровень {character.level} – {character.race} {character.class}
          </p>
          <p className="text-sm text-gray-500">Опыт: {character.experience}</p>
        </div>

        {/* Основная сетка (3 колонки) */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Левая колонка – статус, характеристики, валюта */}
          <div className="space-y-6">
            {character.character_status && (
              <CharacterStatusEditor
                characterId={character.id}
                initialStatus={character.character_status}
              />
            )}
            {character.ability_scores && (
              <AbilityScoresEditor
                characterId={character.id}
                initialScores={character.ability_scores}
              />
            )}
            <CurrencyEditor
              characterId={character.id}
              initialGold={character.gold}
              initialSilver={character.silver}
              initialCopper={character.copper}
            />
          </div>

          {/* Средняя колонка – навыки и заклинания */}
          <div className="space-y-6">
            <SkillList characterId={character.id} />
            <SpellPanel characterId={character.id} />
          </div>

          {/* Правая колонка – броски и история */}
          <div className="space-y-6">
            <DiceRoller characterId={character.id} />
            <DiceHistoryChart characterId={character.id} />
          </div>
        </div>
      </div>
    </div>
  );
}