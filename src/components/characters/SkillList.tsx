'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { translateSkill } from '@/lib/dictionary/skills';

type Skill = { id: string; skill_name: string; ability_score: string; proficiency: boolean; bonus: number };
type Ability = { strength: number; dexterity: number; constitution: number; intelligence: number; wisdom: number; charisma: number; proficiency_bonus: number };

const getMod = (score: number) => Math.floor((score - 10) / 2);

export default function SkillList({ characterId }: { characterId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [ability, setAbility] = useState<Ability | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: s } = await supabase.from('skills').select('*').eq('character_id', characterId);
      const { data: a } = await supabase.from('ability_scores').select('*').eq('character_id', characterId).single();
      if (s) setSkills(s);
      if (a) setAbility(a);
    };
    fetch();
  }, [characterId]);

  const toggleProf = async (id: string, current: boolean) => {
    await supabase.from('skills').update({ proficiency: !current }).eq('id', id);
    setSkills(prev => prev.map(s => s.id === id ? { ...s, proficiency: !current } : s));
  };

  if (!ability) return <div className="card">Загрузка навыков...</div>;

  const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  const statNames: Record<string, string> = {
    strength: 'Сила', dexterity: 'Ловкость', constitution: 'Телосложение',
    intelligence: 'Интеллект', wisdom: 'Мудрость', charisma: 'Харизма'
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gold mb-2">Навыки</h2>
      {stats.map(stat => {
        const statSkills = skills.filter(s => s.ability_score === stat);
        if (!statSkills.length) return null;
        const mod = getMod(ability[stat as keyof Ability]);
        return (
          <div key={stat} className="mb-3">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">{statNames[stat]} (мод {mod >= 0 ? `+${mod}` : mod})</h3>
            {statSkills.map(skill => {
              const total = mod + (skill.proficiency ? ability.proficiency_bonus : 0) + skill.bonus;
              return (
                <div key={skill.id} className="flex justify-between items-center ml-2 py-0.5">
                  <span className="text-[var(--text-primary)]">{translateSkill(skill.skill_name)}</span>
                  <div>
                    <span className={`font-mono ${total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {total >= 0 ? `+${total}` : total}
                    </span>
                    <button onClick={() => toggleProf(skill.id, skill.proficiency)} className="ml-2 text-xs bg-[var(--bg-primary)] text-[var(--text-primary)] px-1 rounded border border-[var(--border)]">
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