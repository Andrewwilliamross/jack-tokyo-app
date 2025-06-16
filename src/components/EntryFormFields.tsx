import React, { useState } from 'react';
import { MapPin, Plus, LocateFixed, Lightbulb, Pencil } from 'lucide-react';
import { LocationField } from './LocationField';

const CITIES = [
  'Tokyo',
  'Osaka',
  'Kyoto',
  'Sapporo',
  'Fukuoka',
  'Nagoya',
];
const TOKYO_WARDS = [
  'Shibuya',
  'Shinjuku',
  'Chiyoda',
  'Minato',
  'Setagaya',
  'Taito',
  'Sumida',
  'Meguro',
  'Bunkyo',
  'Chuo',
];
const PRESET_TAGS = [
  '🚆 Transit', '🏙️ Infrastructure', '🛍️ Retail', '🍜 Food', '🏠 Housing', '👥 Crowds', '💴 Prices', '🏢 Business', '🧼 Cleanliness', '📶 Connectivity', '🤖 Robots', '🔧 Labor Intensity', '🛑 Rules', '🎓 Education', '📦 Logistics', '🧃 Vending Machine', '🚇 Train Check', '🎌 Peak Japan', '🦑 Mystery Snack', '🎮 Arcade', '🦀 7/11 Core', '👟 Weird Drip', '📸 Tourists', '🛐 Shrine', '🐸 Capsule Haul', '🎴 Anime IRL', '📦 Tiny Apartment', '🧍 Salaryman Sighting', '💤 Public Sleeping'
];
const PROMPTS = [
  "What's awesome about transportation in Japan?",
  "How busy do the markets seem?",
  "Are restaurants full or half-empty?",
  "Are people out shopping or just passing through?",
  "Do prices feel cheap, fair, or high?",
  "Is there new construction happening around the city?",
  "What kind of businesses are opening up?",
  "Does this place feel like it's thriving or struggling?",
  "How are people behaving in public — quiet, rushed, relaxed?",
  "Is there any tech or automation here that stands out?"
];

interface EntryFormFieldsProps {
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  researchNotes: string;
  onResearchNotesChange: (notes: string) => void;
  location: string;
  onLocationChange: (location: string, streetAddress?: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  readOnly?: boolean;
}

export const EntryFormFields: React.FC<EntryFormFieldsProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  researchNotes,
  onResearchNotesChange,
  location,
  onLocationChange,
  tags,
  onTagsChange,
  readOnly = false,
}) => {
  const [city, setCity] = useState('Tokyo');
  const [ward, setWard] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [showWard, setShowWard] = useState(true);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [lightOn, setLightOn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingLocation, setEditingLocation] = useState(false);

  // Handle city/ward selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    if (e.target.value === 'Tokyo') {
      setShowWard(true);
      setWard('');
      onLocationChange('Tokyo');
    } else {
      setShowWard(false);
      setWard('');
      onLocationChange(e.target.value);
    }
  };
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWard(e.target.value);
    onLocationChange(`Tokyo, ${e.target.value}`);
  };
  const handleCustomLocation = () => {
    if (customLocation.trim()) {
      onLocationChange(customLocation.trim());
      setShowCustomLocation(false);
      setCity('');
      setWard('');
    }
  };
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationChange(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  // Tag logic
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        onTagsChange([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  const togglePresetTag = (tag: string) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter(t => t !== tag));
    } else {
      onTagsChange([...tags, tag]);
    }
  };
  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  // Prompt logic
  const handlePrompt = () => {
    setLightOn(true);
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setTimeout(() => setLightOn(false), 1200);
  };

  // Location edit logic
  const handleLocationEdit = () => setEditingLocation(true);
  const handleLocationBlur = () => setEditingLocation(false);

  return (
    <div className="space-y-3">
      {/* Title Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Entry Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Add a title for your entry..."
          className="w-full p-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-pink"
        />
      </div>

      {/* Location Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        {readOnly && !editingLocation ? (
          <div className="flex items-center gap-2">
            <span className="text-base">{location || <span className="text-muted-foreground">No location</span>}</span>
            <button
              type="button"
              className="p-1 rounded hover:bg-muted transition-colors"
              onClick={handleLocationEdit}
              title="Edit location"
            >
              <Pencil size={16} />
            </button>
          </div>
        ) : (
          <div onBlur={handleLocationBlur} tabIndex={-1} className="outline-none">
            <LocationField
              value={location}
              onChange={onLocationChange}
              error={errors.location}
              showLabel={false}
            />
          </div>
        )}
      </div>

      {/* Media Upload handled outside */}

      {/* Tags Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          placeholder="Add custom tag..."
          className="w-full p-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-pink mb-2"
        />
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => togglePresetTag(tag)}
              className={`text-xs px-3 py-1 rounded transition-colors border border-border ${tags.includes(tag) ? 'bg-neon-pink text-white' : 'bg-asphalt-grey text-accent'}`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.filter(tag => !PRESET_TAGS.includes(tag)).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-asphalt-grey text-accent px-2 py-1 rounded flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your experience..."
          className="w-full p-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-pink"
        />
      </div>

      {/* Research Notes Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Research Notes</label>
        <textarea
          value={researchNotes}
          onChange={(e) => onResearchNotesChange(e.target.value)}
          placeholder="Add your research notes..."
          rows={2}
          className="w-full p-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-pink resize-none"
        />
      </div>

      {/* Prompt Lightbulb */}
      <div className="flex justify-end items-center mt-2">
        {prompt && (
          <span className="mr-3 text-sm text-muted-foreground animate-fade-in">{prompt}</span>
        )}
        <button
          type="button"
          className="p-2 rounded-full border border-border bg-muted hover:bg-yellow-200 transition-colors"
          onClick={handlePrompt}
          title="Show prompt idea"
        >
          <Lightbulb size={20} className={lightOn ? 'text-yellow-400' : 'text-gray-400'} />
        </button>
      </div>
    </div>
  );
};
