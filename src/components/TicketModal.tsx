import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MediaUploadSection } from './MediaUploadSection';
import { EntryFormFields } from './EntryFormFields';
import { useEntryStore, MediaFile as StoreMediaFile } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { createEntry, updateEntry as updateEntryDb, getEntry } from '@/supabase/utils/entries';
import { uploadMedia } from '@/supabase/utils/media';
import { supabase } from '@/supabase/config/client';
import { useAuthStore } from '@/lib/store/auth';
import { useNavigate } from 'react-router-dom';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEntryId?: string;
}

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, editingEntryId }) => {
  const { entries, addEntry, updateEntry, setCurrentEntry, loadEntries } = useEntryStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [researchNotes, setResearchNotes] = useState('');
  const [location, setLocation] = useState('');
  const [streetAddress, setStreetAddress] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check authentication when modal opens
  useEffect(() => {
    if (isOpen && !user) {
      toast.error('You must be logged in to create entries');
      onClose();
      navigate('/login');
    }
  }, [isOpen, user, onClose, navigate]);

  // Load entry data if editing
  useEffect(() => {
    if (editingEntryId) {
      const entry = entries.find(e => e.id === editingEntryId);
      if (entry) {
        setTitle(entry.title);
        setDescription(entry.description);
        setResearchNotes(entry.researchNotes);
        setLocation(entry.location);
        setStreetAddress(entry.streetAddress);
        setTags(entry.tags);
        setSelectedPreviewId(entry.previewMediaId);
        // Note: We can't restore the actual File objects, but we can show the URLs
        setMediaFiles(entry.mediaFiles.map(mf => ({
          id: mf.id,
          url: mf.url,
          type: mf.type,
          file: new File([], '') // Placeholder file
        })));
      }
    }
  }, [editingEntryId, entries]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (mediaFiles.length === 0) {
      newErrors.media = 'At least one media file is required';
    }
    if (!selectedPreviewId) {
      newErrors.preview = 'Please select a preview image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const newMedia: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url,
        type
      };
      
      setMediaFiles(prev => {
        const newFiles = [...prev, newMedia];
        // Auto-select first media as preview if none selected
        if (!selectedPreviewId) {
          setSelectedPreviewId(newMedia.id);
        }
        return newFiles;
      });
    });

    // Reset the input
    event.target.value = '';
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      const newFiles = prev.filter(f => f.id !== id);
      
      // If removed media was selected as preview, select first remaining or clear
      if (selectedPreviewId === id) {
        setSelectedPreviewId(newFiles.length > 0 ? newFiles[0].id : null);
      }
      
      return newFiles;
    });
  };

  const handlePreviewSelect = (id: string) => {
    setSelectedPreviewId(id);
  };

  const handleClose = () => {
    // Clean up object URLs when closing
    mediaFiles.forEach(media => URL.revokeObjectURL(media.url));
    setMediaFiles([]);
    setSelectedPreviewId(null);
    setTitle('');
    setDescription('');
    setResearchNotes('');
    setLocation('');
    setStreetAddress(undefined);
    setTags([]);
    setCurrentEntry(null);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save entries');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      let entry;
      if (editingEntryId) {
        // Update entry in Supabase
        console.log('User object (update):', user);
        console.log('Payload to Supabase (update):', {
          title: title || 'Untitled Entry',
          description,
          research_notes: researchNotes,
          location_id: null,
          status: 'draft',
          created_by: user.id,
        });
        entry = await updateEntryDb(editingEntryId, {
          title: title || 'Untitled Entry',
          description,
          research_notes: researchNotes,
          location_id: null, // You may want to resolve location_id from location string if needed
          status: 'draft',
        }, user.id);
      } else {
        // Create entry in Supabase
        console.log('User object (create):', user);
        console.log('Payload to Supabase (create):', {
          title: title || 'Untitled Entry',
          description,
          research_notes: researchNotes,
          location_id: null,
          status: 'draft',
          created_by: user.id,
        });
        entry = await createEntry({
          title: title || 'Untitled Entry',
          description,
          research_notes: researchNotes,
          location_id: null, // You may want to resolve location_id from location string if needed
          status: 'draft',
        }, user.id);
      }

      // Upload media files
      for (const fileObj of mediaFiles) {
        if (fileObj.file.size > 0) { // Only upload actual files
          await uploadMedia(entry.id, fileObj.file, fileObj.id === selectedPreviewId);
        }
      }

      // Reload entries to get updated data
      await loadEntries();

      toast.success(`Entry ${editingEntryId ? 'updated' : 'created'} successfully!`);
      handleClose();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error(error.message || 'Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTitle = title || 'New Entry Draft';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-border flex-shrink-0">
          <DialogTitle className="text-xl font-bold neon-glow">
            {displayTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new entry with media uploads and form details
          </DialogDescription>
        </DialogHeader>
        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-8">
            <MediaUploadSection
              mediaFiles={mediaFiles}
              selectedPreviewId={selectedPreviewId}
              onMediaUpload={handleMediaUpload}
              onRemoveMedia={removeMedia}
              onPreviewSelect={handlePreviewSelect}
            />
            {errors.media && (
              <p className="text-red-500 text-sm">{errors.media}</p>
            )}
            {errors.preview && (
              <p className="text-red-500 text-sm">{errors.preview}</p>
            )}
            <EntryFormFields 
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              researchNotes={researchNotes}
              onResearchNotesChange={setResearchNotes}
              location={location}
              onLocationChange={(loc, addr) => {
                setLocation(loc);
                setStreetAddress(addr);
              }}
              tags={tags}
              onTagsChange={setTags}
            />
          </div>
        </ScrollArea>
        {/* Footer */}
        <div className="p-6 border-t border-border flex-shrink-0 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={cn(
              "run-button px-8 py-2 rounded-lg text-white font-medium",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:shadow-lg hover:shadow-neon-pink/20",
              "transition-all duration-200"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              'Save Entry'
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
