import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image, Video, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface MediaUploadSectionProps {
  mediaFiles: MediaFile[];
  selectedPreviewId: string | null;
  onMediaUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: (id: string) => void;
  onPreviewSelect: (id: string) => void;
}

export const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  mediaFiles,
  selectedPreviewId,
  onMediaUpload,
  onRemoveMedia,
  onPreviewSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Media</label>
        <span className="text-xs text-muted-foreground">
          {mediaFiles.length} {mediaFiles.length === 1 ? 'file' : 'files'} uploaded
        </span>
      </div>

      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onMediaUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="media-upload"
        />
        <Button
          variant="outline"
          className="w-full h-24 border-dashed border-2 hover:bg-muted/50 transition-colors"
          asChild
        >
          <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">Upload Images or Videos</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
            </div>
          </label>
        </Button>
      </div>

      {/* Media Preview Thumbnails */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {mediaFiles.map((media) => (
            <div
              key={media.id}
              className="relative aspect-square group rounded-lg overflow-hidden bg-muted border border-border"
            >
              {/* Media Preview */}
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  muted
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Media Type Indicator */}
              <div className="absolute top-2 left-2">
                {media.type === 'image' ? (
                  <div className="bg-black/70 text-white rounded-full p-1.5">
                    <Image size={14} />
                  </div>
                ) : (
                  <div className="bg-black/70 text-white rounded-full p-1.5">
                    <Video size={14} />
                  </div>
                )}
              </div>

              {/* Preview Selection Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                  selectedPreviewId === media.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <button
                  onClick={() => onPreviewSelect(media.id)}
                  className={cn(
                    "p-2 rounded-full transition-all transform hover:scale-110",
                    selectedPreviewId === media.id
                      ? "bg-neon-pink text-white shadow-lg"
                      : "bg-black/70 text-white hover:bg-neon-pink/80"
                  )}
                  title="Set as preview"
                >
                  <Crown size={16} />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemoveMedia(media.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                  opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110
                  hover:bg-red-600"
                title="Remove media"
              >
                <X size={14} />
              </button>

              {/* Preview Badge */}
              {selectedPreviewId === media.id && (
                <div className="absolute bottom-2 left-2 bg-neon-pink text-white text-xs px-2 py-1 rounded-full">
                  Preview
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
