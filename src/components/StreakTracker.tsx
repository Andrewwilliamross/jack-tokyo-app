
import React from 'react';

interface StreakTrackerProps {
  streakDays: number;
  className?: string;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  streakDays,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center gap-2 h-fit ${className}`}>
      <span className="text-3xl font-bold neon-glow">Streak:</span>
      <span className="streak-flame text-3xl">🔥</span>
      <span className="text-3xl font-bold text-vapor-orange">{streakDays}</span>
    </div>
  );
};
