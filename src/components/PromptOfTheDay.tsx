import React, { useState, useEffect, useMemo } from 'react';
import { useEntryStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';
import { PromptOfTheDayModal } from './PromptOfTheDayModal';

export const PromptOfTheDay: React.FC = () => {
  const { currentPrompt, setCurrentPrompt, entries } = useEntryStore();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if there is an entry for the current prompt
  const isPromptCompleted = useMemo(() => {
    if (!currentPrompt) return false;
    return entries.some(entry => entry.promptText === currentPrompt.text);
  }, [entries, currentPrompt]);

  // Initialize prompt if none exists or if expired
  useEffect(() => {
    if (!currentPrompt) {
      const prompts = [
        "Take a photo of the weirdest vending machine you encounter today",
        "Find and document a unique Japanese convenience store item",
        "Capture the most crowded train station you visit",
        "Photograph a traditional Japanese architectural element",
        "Find and document a local street food vendor",
        "Take a picture of an interesting public transportation sign",
        "Capture a moment of Japanese work culture",
        "Document a unique Japanese technology or automation",
        "Find and photograph a hidden shrine or temple",
        "Capture a moment of Japanese pop culture"
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt);
      return;
    }
    // Check if the prompt has expired
    const now = new Date();
    const expiresAt = new Date(currentPrompt.expiresAt);
    if (now > expiresAt) {
      setCurrentPrompt(null);
    }
  }, [currentPrompt, setCurrentPrompt]);

  // Update time left
  useEffect(() => {
    if (!currentPrompt) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const expiresAt = new Date(currentPrompt.expiresAt);
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [currentPrompt]);

  const handleCompletePrompt = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (!currentPrompt) return null;

  return (
    <>
      <div className="feature-card rounded-lg p-6 tokyo-shimmer">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold neon-glow">🎯 Prompt of the Day</h3>
          <div className="bg-vapor-orange/20 border border-vapor-orange/50 rounded-full px-3 py-1">
            <span className="text-vapor-orange text-sm font-bold">+50 XP</span>
          </div>
        </div>
        
        <p className="text-lg mb-4 text-foreground">
          {currentPrompt.text}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Time left:</span>
              <span className="text-neon-teal font-mono">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleCompletePrompt}
            className="run-button px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-neon-pink/20 transition-all duration-200"
            disabled={isPromptCompleted}
          >
            {isPromptCompleted ? 'Completed!' : 'Complete Prompt'}
          </button>
        </div>
      </div>

      <PromptOfTheDayModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        prompt={currentPrompt.text}
      />
    </>
  );
};
