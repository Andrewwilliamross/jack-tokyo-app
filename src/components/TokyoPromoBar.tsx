import React, { useState } from 'react';
import { X } from 'lucide-react';

export const TokyoPromoBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-neon-pink to-royal-blue text-white px-4 py-2 text-sm font-medium relative">
      <div className="flex items-center justify-center gap-2 max-w-6xl mx-auto">
        <span className="animate-neon-pulse">🏮</span>
        <span>Welcome to Jack's Meicho Shimbun - Track your Japan experience, gather intel, and level up!</span>
        <span className="animate-neon-pulse">🗾</span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};