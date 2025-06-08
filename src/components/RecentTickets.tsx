import React from 'react';
import { useEntryStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

interface RecentTicketsProps {
  onEditEntry: (entryId: string) => void;
}

export const RecentTickets: React.FC<RecentTicketsProps> = ({ onEditEntry }) => {
  const { entries, deleteEntry } = useEntryStore();

  const handleDelete = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold neon-glow">Recent Tickets</h2>
      <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-sm">No entries yet. Create your first entry!</p>
        ) : (
          entries.map((entry) => {
            const preview = entry.mediaFiles.find(m => m.id === entry.previewMediaId);
            return (
              <div
                key={entry.id}
                onClick={() => onEditEntry(entry.id)}
                className="ticket-card min-w-[340px] max-w-[340px] h-[340px] rounded-2xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer flex flex-col justify-between"
              >
                {/* Image Preview with Padding */}
                <div className="p-4 pb-0">
                  <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-xl overflow-hidden">
                    {preview ? (
                      preview.type === 'image' ? (
                        <img
                          src={preview.url}
                          alt="Entry preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={preview.url}
                          className="w-full h-full object-cover"
                          muted
                          controls={false}
                          autoPlay={false}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl">
                        No Preview
                      </div>
                    )}
                  </div>
                </div>
                {/* Card Content */}
                <div className="px-4 pt-3 pb-4 flex flex-col flex-1 justify-end">
                  <h3 className="font-bold text-lg mb-1 text-white truncate">{entry.title}</h3>
                  <div className="flex flex-col gap-1 mb-2">
                    <span className="text-neon-teal text-base font-medium truncate max-w-[60%]">
                      {entry.location || '—'}
                    </span>
                    {entry.streetAddress && (
                      <span className="text-sm text-muted-foreground truncate">
                        {entry.streetAddress}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground self-end">
                      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-asphalt-grey text-accent px-3 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex-1" />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={(e) => handleDelete(e, entry.id)}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};