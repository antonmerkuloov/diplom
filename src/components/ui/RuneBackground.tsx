'use client';
import { useEffect, useState } from 'react';

const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

export default function RuneBackground() {
  const [positions, setPositions] = useState<{ x: number; y: number; rune: string; size: number; speed: number }[]>([]);

  useEffect(() => {
    const newPositions = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      rune: runes[Math.floor(Math.random() * runes.length)],
      size: 16 + Math.random() * 32,
      speed: 0.5 + Math.random() * 2,
    }));
    setPositions(newPositions);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-40">
        {positions.map((pos, idx) => (
          <text
            key={idx}
            x={`${pos.x}%`}
            y={`${pos.y}%`}
            fontSize={pos.size}
            fill="var(--rune-color)"
            fontFamily="serif"
            fontWeight="bold"
            dominantBaseline="middle"
            textAnchor="middle"
            opacity={0.6}
            style={{ animation: `float ${pos.speed}s infinite alternate ease-in-out` }}
          >
            {pos.rune}
          </text>
        ))}
      </svg>
    </div>
  );
}