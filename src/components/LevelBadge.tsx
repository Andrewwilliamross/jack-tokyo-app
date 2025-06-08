
import React from 'react';

interface LevelBadgeProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  className?: string;
}

const levels = [
  { id: 1, name: "Gaijin", emoji: "🧍‍♂️", xpRequired: 0 },
  { id: 2, name: "Language School Student", emoji: "👨‍🎓", xpRequired: 500 },
  { id: 3, name: "Ramen Apprentice", emoji: "🏮", xpRequired: 1200 },
  { id: 4, name: "JR Line Conductor", emoji: "🚆", xpRequired: 2500 },
  { id: 5, name: "Salaryman", emoji: "🏢", xpRequired: 5000 },
  { id: 6, name: "Izakaya Manager", emoji: "🍶", xpRequired: 8500 },
  { id: 7, name: "Prefecture Governor", emoji: "🏯", xpRequired: 14000 },
  { id: 8, name: "Shinjuku Police Chief", emoji: "🚓", xpRequired: 22000 },
  { id: 9, name: "Shadow Cabinet Minister", emoji: "🗾", xpRequired: 35000 },
  { id: 10, name: "Yakuza CEO", emoji: "🕴️", xpRequired: 50000 },
];

export const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  currentLevel, 
  currentXP, 
  nextLevelXP, 
  className = "" 
}) => {
  const level = levels.find(l => l.id === currentLevel) || levels[0];
  const progress = ((currentXP - level.xpRequired) / (nextLevelXP - level.xpRequired)) * 100;

  return (
    <div className={`level-badge rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{level.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-white neon-glow">{level.name}</span>
            <span className="text-xs text-accent">{currentXP} XP</span>
          </div>
          <div className="w-full bg-asphalt-grey rounded-full h-2 overflow-hidden">
            <div 
              className="xp-bar h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
