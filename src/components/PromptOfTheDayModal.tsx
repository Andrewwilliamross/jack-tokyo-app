import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MediaUploadSection } from './MediaUploadSection';
import { EntryFormFields } from './EntryFormFields';
import { useEntryStore } from '@/lib/store';
import { Camera, Plus, Loader2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { LocationField } from './LocationField';
import { createEntry, getEntry } from '@/supabase/utils/entries';
import { uploadMedia } from '@/supabase/utils/media';
import { supabase } from '@/supabase/config/client';

interface PromptOfTheDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
}

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

export const PromptOfTheDayModal: React.FC<PromptOfTheDayModalProps> = ({
  isOpen,
  onClose,
  prompt
}) => {
  const { completePrompt } = useEntryStore();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingLocation, setEditingLocation] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
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

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg');
      });

      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      const url = URL.createObjectURL(file);
      
      const newMedia: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url,
        type: 'image'
      };

      setMediaFiles(prev => {
        const newFiles = [...prev, newMedia];
        if (!selectedPreviewId) {
          setSelectedPreviewId(newMedia.id);
        }
        return newFiles;
      });

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
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
    setDescription('');
    setLocation('');
    setTags([]);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current session and user
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      console.log('User:', user);
      console.log('Session:', session);
      console.log('User object (create):', user);
      console.log('Payload to Supabase (create):', {
        title: prompt || 'Untitled Entry',
        description,
        research_notes: '',
        location_id: null,
        status: 'draft',
        created_by: user?.id,
      });
      if (!user) {
        toast.error('You must be logged in to submit an entry.');
        setIsSubmitting(false);
        return;
      }

      // 1. Create entry in Supabase
      const entry = await createEntry({
        title: prompt || 'Untitled Entry',
        description,
        research_notes: '',
        location_id: null,
        status: 'draft',
      }, user.id);

      // 2. Upload media files
      for (const fileObj of mediaFiles) {
        await uploadMedia(entry.id, fileObj.file, fileObj.id === selectedPreviewId);
      }

      // 3. Fetch the full entry with media
      const fullEntry = await getEntry(entry.id);

      // Optionally update local state/UI here if needed
      completePrompt();
      toast.success('Entry created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error(error.message || 'Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full h-[90vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-border flex-shrink-0">
          <DialogTitle className="text-xl font-bold neon-glow">
            Complete Prompt
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-8">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-lg font-medium">{prompt}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              {(!editingLocation && location) ? (
                <div className="flex items-center gap-2">
                  <span className="text-base">{location}</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-muted transition-colors"
                    onClick={() => setEditingLocation(true)}
                    title="Edit location"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              ) : (
                <div onBlur={() => setEditingLocation(false)} tabIndex={-1} className="outline-none">
                  <LocationField
                    value={location}
                    onChange={setLocation}
                    error={errors.location}
                  />
                </div>
              )}
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your experience..."
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
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