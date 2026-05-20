'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { translateSkill } from '@/lib/dictionary/skills';

type Skill = { id: string; skill_name: string; ability_score: string; proficiency: boolean; bonus: number };
type Ability = { strength: number; dexterity: number; constitution: number; intelligence: number; wisdom: number; charisma: number; proficiency_bonus: number };

const getMod = (score: number) => Math.floor((score - 10) / 2);

export default function SkillList({ characterId }: { characterId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [abilities, setAbilities] = useState<Ability | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: s } = await supabase.from('skills').select('*').eq('character_id', characterId);
      const { data: a } = await supabase.from('ability_scores').select('*').eq('character_id', characterId).single();
      if (s) setSkills(s);
      if (a) setAbilities(a);
    };
    fetch();
  }, [characterId]);

  const toggleProf = async (id: string, val: boolean) => {
    await supabase.from('skills').update({ proficiency: !val }).eq('id', id);
    setSkills(prev => prev.map(s => s.id === id ? { ...s, proficiency: !val } : s));
  };

  if (!abilities) return <div className="text-gray-400">Загрузка...</div>;

  const groups = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  const groupNames: Record<string, string> = { strength: 'Сила', dexterity: 'Ловкость', constitution: 'Телосложение', intelligence: 'Интеллект', wisdom: 'Мудрость', charisma: 'Харизма' };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold">Навыки</h2>
      {groups.map(stat => {
        const statSkills = skills.filter(s => s.ability_score === stat);
        if (statSkills.length === 0) return null;
        const mod = getMod(abilities[stat as keyof Ability]);
        return (
          <div key={stat} className="mt-2">
            <h3 className="text-sm font-medium text-gray-300">{groupNames[stat]} (мод {mod >= 0 ? `+${mod}` : mod})</h3>
            {statSkills.map(skill => {
              const total = mod + (skill.proficiency ? abilities.proficiency_bonus : 0) + skill.bonus;
              return (
                <div key={skill.id} className="flex justify-between items-center ml-2">
                  <span>{translateSkill(skill.skill_name)}</span>
                  <div>
                    <span className={`font-mono ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>{total >= 0 ? `+${total}` : total}</span>
                    <button onClick={() => toggleProf(skill.id, skill.proficiency)} className="ml-2 text-xs bg-gray-700 px-1 rounded">
                      {skill.proficiency ? '✔' : '+'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}