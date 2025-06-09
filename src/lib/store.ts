
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { listEntries, getEntry, createEntry, updateEntry as updateEntryDb, deleteEntry as deleteEntryDb } from '@/supabase/utils/entries';

export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  file?: File; // Optional because we can't store File objects in localStorage
}

export interface Entry {
  id: string;
  title: string;
  description: string;
  researchNotes: string;
  location: string;
  streetAddress?: string;
  tags: string[];
  mediaFiles: MediaFile[];
  createdAt: string;
  updatedAt: string;
  previewMediaId: string | null;
  promptText?: string; // Optional: only set for prompt of the day entries
}

interface EntryStore {
  entries: Entry[];
  currentEntry: Entry | null;
  streakDays: number;
  currentPrompt: {
    text: string;
    expiresAt: string;
    completed: boolean;
  } | null;
  setEntries: (entries: Entry[]) => void;
  loadEntries: () => Promise<void>;
  addEntry: (entry: Entry) => void;
  updateEntry: (entryId: string, updatedEntry: Partial<Entry>) => void;
  deleteEntry: (entryId: string) => Promise<void>;
  setCurrentEntry: (entry: Entry | null) => void;
  calculateStreak: () => void;
  setCurrentPrompt: (prompt: string) => void;
  completePrompt: () => void;
}

const calculateStreakFromEntries = (entries: Entry[]): number => {
  if (entries.length === 0) return 0;

  // Sort entries by date, newest first
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Check if the streak is broken (more than 24 hours since last entry)
  const now = new Date();
  const lastEntryTime = new Date(sortedEntries[0].createdAt);
  const hoursSinceLastEntry = (now.getTime() - lastEntryTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastEntry > 24) return 0;

  // Calculate consecutive days
  let streak = 1;
  let currentDate = new Date(sortedEntries[0].createdAt);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].createdAt);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = entryDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
};

const PROMPTS = [
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

export const useEntryStore = create<EntryStore>()(
  persist(
    (set, get) => ({
      entries: [],
      currentEntry: null,
      streakDays: 0,
      currentPrompt: null,
      setEntries: (entries) => set({ entries }),
      loadEntries: async () => {
        try {
          const { entries: dbEntries } = await listEntries();
          // Map Supabase entries to Zustand Entry type
          const entries = dbEntries.map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description ?? '',
            researchNotes: e.research_notes ?? '',
            location: e.location_id ?? '',
            streetAddress: '', // You may want to resolve this if you store it
            tags: e.tags ? e.tags.map((t: any) => t.tag?.name ?? '') : [],
            mediaFiles: e.media ? e.media.map((m: any) => ({
              id: m.id,
              url: m.storage_path, // You may want to use getMediaUrl here
              type: m.media_type,
            })) : [],
            createdAt: e.created_at,
            updatedAt: e.updated_at,
            previewMediaId: e.media ? (e.media.find((m: any) => m.is_preview)?.id ?? null) : null,
          }));
          set({ entries });
          get().calculateStreak();
        } catch (error) {
          console.error('Error loading entries:', error);
        }
      },
      addEntry: (entry) => {
        set((state) => ({
          entries: [entry, ...state.entries]
        }));
        get().calculateStreak();
      },
      updateEntry: (entryId, updatedEntry) => {
        set((state) => ({
          entries: state.entries.map(entry =>
            entry.id === entryId ? { ...entry, ...updatedEntry } : entry
          )
        }));
      },
      deleteEntry: async (entryId) => {
        try {
          // Get current user
          const { supabase } = await import('@/supabase/config/client');
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          await deleteEntryDb(entryId, user.id);
          set((state) => ({
            entries: state.entries.filter(entry => entry.id !== entryId)
          }));
          get().calculateStreak();
        } catch (error) {
          console.error('Error deleting entry:', error);
          throw error;
        }
      },
      setCurrentEntry: (entry) => {
        set({ currentEntry: entry });
      },
      calculateStreak: () => {
        set((state) => ({
          streakDays: calculateStreakFromEntries(state.entries),
        }));
      },
      setCurrentPrompt: (prompt) => {
        // Set prompt to expire at midnight Tokyo time
        const now = new Date();
        const tokyoTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const expiresAt = new Date(tokyoTime);
        expiresAt.setHours(24, 0, 0, 0);
        set({
          currentPrompt: {
            text: prompt,
            expiresAt: expiresAt.toISOString(),
            completed: false
          }
        });
      },
      completePrompt: () => {
        set((state) => ({
          currentPrompt: state.currentPrompt ? {
            ...state.currentPrompt,
            completed: true
          } : null
        }));
      }
    }),
    {
      name: 'meicho-entries',
    }
  )
);
