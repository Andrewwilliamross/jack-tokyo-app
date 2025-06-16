import React, { useState, useEffect } from 'react';
import { LevelBadge } from './LevelBadge';
import { StreakTracker } from './StreakTracker';
import { PromptOfTheDay } from './PromptOfTheDay';
import { RecentTickets } from './RecentTickets';
import { TicketModal } from './TicketModal';
import { Plus } from 'lucide-react';
import { useEntryStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

interface MissionControlProps {
  showModal?: boolean;
  onModalClose?: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  showModal = false,
  onModalClose
}) => {
  const [isModalOpen, setIsModalOpen] = useState(showModal);
  const [editingEntryId, setEditingEntryId] = useState<string | undefined>();
  const { entries, streakDays, calculateStreak } = useEntryStore();
  const [tokyoTime, setTokyoTime] = useState('');
  const [tokyoDate, setTokyoDate] = useState('');

  // Update Tokyo time every second
  useEffect(() => {
    const updateTokyoTime = () => {
      const now = new Date();
      const tokyoTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(now);
      
      const tokyoDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo',
        month: 'long',
        day: 'numeric'
      }).format(now);

      setTokyoTime(tokyoTime);
      setTokyoDate(tokyoDate);
    };

    updateTokyoTime();
    const interval = setInterval(updateTokyoTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate streak when component mounts
  useEffect(() => {
    calculateStreak();
  }, [calculateStreak]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingEntryId(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntryId(undefined);
    if (onModalClose) onModalClose();
  };

  const handleEditEntry = (entryId: string) => {
    setEditingEntryId(entryId);
    setIsModalOpen(true);
  };

  const lastEntry = entries[0];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level & XP */}
        <div className="lg:col-span-2">
          <LevelBadge 
            currentLevel={3}
            currentXP={1450}
            nextLevelXP={2500}
          />
        </div>
        
        {/* Streak */}
        <div className="feature-card rounded-lg p-4 flex items-center justify-center h-fit">
          <StreakTracker streakDays={streakDays} />
        </div>
      </div>

      {/* Time & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="feature-card rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Tokyo, Japan</div>
            <div className="text-3xl font-bold neon-glow mb-2">{tokyoTime}</div>
            <div className="text-sm text-muted-foreground">{tokyoDate}</div>
          </div>
        </div>
        
        <div className="feature-card rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Last Entry</div>
            {lastEntry ? (
              <>
                <div className="text-3xl font-bold neon-glow mb-2">{lastEntry.title}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(lastEntry.createdAt), { addSuffix: true })}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">No entries yet</div>
            )}
          </div>
        </div>
      </div>

      {/* New Entry Button */}
      <button 
        onClick={handleOpenModal}
        className="run-button w-full py-4 rounded-lg flex items-center justify-center gap-3 text-lg font-bold"
      >
        <Plus size={24} />
        Draft New Entry
      </button>

      {/* Prompt of the Day */}
      <PromptOfTheDay />

      {/* Recent Tickets */}
      <RecentTickets onEditEntry={handleEditEntry} />

      {/* Ticket Modal */}
      <TicketModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editingEntryId={editingEntryId}
      />
    </div>
  );
};
