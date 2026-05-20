'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { translateSkill } from '@/lib/dictionary/skills';

type Skill = { id: string; name: string; bonus: number };
type Ability = { name: string; bonus: number };
type ResultItem = { name: string; roll: number; total: number; bonus: number };

const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export default function DiceRoller({ characterId }: { characterId: string }) {
  const [dice, setDice] = useState('d20');
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const supabase = createClient();

  const getMod = (score: number) => Math.floor((score - 10) / 2);

  // При смене кубика сбрасываем выбранные элементы
  useEffect(() => {
    if (dice !== 'd20') {
      setSelectedIds([]);
    }
  }, [dice]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: skillsData } = await supabase
        .from('skills')
        .select('id, skill_name, ability_score, proficiency, bonus')
        .eq('character_id', characterId);
      const { data: abilityScores } = await supabase
        .from('ability_scores')
        .select('strength, dexterity, constitution, intelligence, wisdom, charisma, proficiency_bonus')
        .eq('character_id', characterId)
        .single();

      if (!skillsData || !abilityScores) return;

      const profBonus = abilityScores.proficiency_bonus;
      const skillsWithBonus = skillsData.map(s => {
        const abilityMod = getMod(abilityScores[s.ability_score as keyof typeof abilityScores] as number);
        const total = abilityMod + (s.proficiency ? profBonus : 0) + s.bonus;
        return { id: s.id, name: translateSkill(s.skill_name), bonus: total };
      });
      setSkills(skillsWithBonus);

      setAbilities([
        { name: 'Сила', bonus: getMod(abilityScores.strength) },
        { name: 'Ловкость', bonus: getMod(abilityScores.dexterity) },
        { name: 'Телосложение', bonus: getMod(abilityScores.constitution) },
        { name: 'Интеллект', bonus: getMod(abilityScores.intelligence) },
        { name: 'Мудрость', bonus: getMod(abilityScores.wisdom) },
        { name: 'Харизма', bonus: getMod(abilityScores.charisma) },
      ]);
    };
    fetchData();
  }, [characterId]);

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const rollForItem = async (name: string, bonus: number) => {
    const sides = 20;
    let rollResult = Math.floor(Math.random() * sides) + 1;
    if (advantage) {
      const second = Math.floor(Math.random() * sides) + 1;
      rollResult = Math.max(rollResult, second);
    } else if (disadvantage) {
      const second = Math.floor(Math.random() * sides) + 1;
      rollResult = Math.min(rollResult, second);
    }
    const total = rollResult + bonus;
    return { name, roll: rollResult, total, bonus };
  };

  const handleCheck = async () => {
    if (selectedIds.length === 0) return;
    const itemsToRoll = [
      ...skills.filter(s => selectedIds.includes(s.id)).map(s => ({ name: s.name, bonus: s.bonus })),
      ...abilities.filter(a => selectedIds.includes(a.name)).map(a => ({ name: a.name, bonus: a.bonus }))
    ];
    const newResults = await Promise.all(itemsToRoll.map(item => rollForItem(item.name, item.bonus)));
    setResults(newResults);

    for (const res of newResults) {
      await supabase.from('dice_rolls').insert({
        character_id: characterId,
        dice_type: 'd20',
        result: res.roll,
        modifier: res.bonus,
        skill_name: res.name,
        advantage,
        disadvantage,
      });
    }
  };

  const rollSimple = async () => {
    let sides = parseInt(dice.slice(1));
    let rollResult = Math.floor(Math.random() * sides) + 1;
    if (advantage) {
      const second = Math.floor(Math.random() * sides) + 1;
      rollResult = Math.max(rollResult, second);
    } else if (disadvantage) {
      const second = Math.floor(Math.random() * sides) + 1;
      rollResult = Math.min(rollResult, second);
    }
    setResults([{ name: dice, roll: rollResult, total: rollResult, bonus: 0 }]);
    await supabase.from('dice_rolls').insert({
      character_id: characterId,
      dice_type: dice,
      result: rollResult,
      modifier: 0,
      skill_name: null,
      advantage,
      disadvantage,
    });
  };

  const allItems = [
    ...skills.map(s => ({ id: s.id, name: s.name, bonus: s.bonus, type: 'skill' })),
    ...abilities.map(a => ({ id: a.name, name: a.name, bonus: a.bonus, type: 'ability' }))
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gold mb-2">Броски</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300">Тип кубика (для обычного броска)</label>
          <select value={dice} onChange={e => setDice(e.target.value)} className="w-full p-2 bg-gray-700 rounded">
            {diceTypes.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex gap-4">
          <label><input type="checkbox" checked={advantage} onChange={() => { setAdvantage(!advantage); if (disadvantage) setDisadvantage(false); }} /> Преимущество</label>
          <label><input type="checkbox" checked={disadvantage} onChange={() => { setDisadvantage(!disadvantage); if (advantage) setAdvantage(false); }} /> Помеха</label>
        </div>

        {/* Панель проверок видна ТОЛЬКО для d20 */}
        {dice === 'd20' && (
          <details className="border border-gray-700 rounded p-2">
            <summary className="cursor-pointer text-gold font-semibold">
              🎲 Проверки навыков и характеристик (всегда d20)
            </summary>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {allItems.map(item => (
                <label key={item.id} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleItem(item.id)} />
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-400">(бонус {item.bonus >= 0 ? `+${item.bonus}` : item.bonus})</span>
                </label>
              ))}
            </div>
            <button onClick={handleCheck} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 rounded mt-2">
              Проверить выбранные ({selectedIds.length})
            </button>
          </details>
        )}

        <button onClick={rollSimple} className="w-full bg-gold text-black font-bold py-2 rounded hover:bg-yellow-600">
          Бросить {dice}
        </button>

        {results.length > 0 && (
          <div className="mt-2 border-t border-gray-700 pt-2">
            <h3 className="font-semibold text-gold text-sm">Результаты:</h3>
            {results.map((res, idx) => (
              <div key={idx} className="text-sm">
                {res.name}: {res.roll} + {res.bonus} = <span className="font-bold">{res.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}