export const skillTranslations: Record<string, string> = {
  'Acrobatics': 'Акробатика',
  'Animal Handling': 'Обращение с животными',
  'Arcana': 'Магия',
  'Athletics': 'Атлетика',
  'Deception': 'Обман',
  'History': 'История',
  'Insight': 'Проницательность',
  'Intimidation': 'Запугивание',
  'Investigation': 'Расследование',
  'Medicine': 'Медицина',
  'Nature': 'Природа',
  'Perception': 'Внимательность',
  'Performance': 'Выступление',
  'Persuasion': 'Убеждение',
  'Religion': 'Религия',
  'Sleight of Hand': 'Ловкость рук',
  'Stealth': 'Скрытность',
  'Survival': 'Выживание'
};

export function translateSkill(name: string): string {
  return skillTranslations[name] || name;
}