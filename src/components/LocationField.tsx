import React, { useState, useRef } from 'react';
import { Plus, LocateFixed } from 'lucide-react';
import { reverseGeocode } from '@/lib/geocoding';

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

interface LocationFieldProps {
  value: string;
  onChange: (location: string, streetAddress?: string) => void;
  error?: string;
  showLabel?: boolean;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
}

export const LocationField: React.FC<LocationFieldProps> = ({ value, onChange, error, showLabel = false }) => {
  const [city, setCity] = useState('Tokyo');
  const [ward, setWard] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [showWard, setShowWard] = useState(true);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to add custom city/ward if not present
  const ensureOption = (list: string[], value: string) => {
    return value && !list.includes(value) ? [value, ...list] : list;
  };

  // Autocomplete logic
  const handleCustomLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomLocation(val);
    setShowSuggestions(true);
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    // Nominatim search API
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(val)}`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'JackMeicho/1.0' } });
    const data = await res.json();
    setSuggestions(data);
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setCustomLocation(suggestion.display_name);
    setShowSuggestions(false);
    // Parse city/ward
    const address = suggestion.address;
    let cityVal = address.city || address.town || address.village || address.state || '';
    let wardVal = address.city_district || address.suburb || address.neighbourhood || '';
    // Update dropdowns, add custom if not present
    setCity(cityVal);
    setWard(wardVal);
    setShowWard(cityVal === 'Tokyo');
    onChange(cityVal === 'Tokyo' && wardVal ? `Tokyo, ${wardVal}` : cityVal, suggestion.display_name);
  };

  // Handle city/ward selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    if (e.target.value === 'Tokyo') {
      setShowWard(true);
      setWard('');
      onChange('Tokyo');
    } else {
      setShowWard(false);
      setWard('');
      onChange(e.target.value);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWard(e.target.value);
    onChange(`Tokyo, ${e.target.value}`);
  };

  const handleCustomLocation = () => {
    if (customLocation.trim()) {
      onChange(customLocation.trim());
      setShowCustomLocation(false);
      setCity('');
      setWard('');
    }
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const geocodingResult = await reverseGeocode(latitude, longitude);
      // Update dropdowns, add custom if not present
      setCity(geocodingResult.city);
      setWard(geocodingResult.ward);
      setShowWard(geocodingResult.city === 'Tokyo');
      setCustomLocation(geocodingResult.fullAddress);
      setShowCustomLocation(true);
      onChange(geocodingResult.city === 'Tokyo' && geocodingResult.ward ? `Tokyo, ${geocodingResult.ward}` : geocodingResult.city, geocodingResult.fullAddress);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomLocationBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200); // allow click
    if (customLocation.trim()) {
      onChange(customLocation.trim());
      setShowCustomLocation(true);
    } else {
      setShowCustomLocation(false);
      setCity('Tokyo');
      setWard('');
    }
  };

  // Render
  return (
    <div>
      {showLabel && <label className="block text-sm font-medium mb-1">Location</label>}
      <div className="flex gap-2 relative">
        <select
          value={city}
          onChange={handleCityChange}
          className="p-2 rounded-lg border border-border bg-muted focus:ring-2 focus:ring-neon-pink"
        >
          {ensureOption(CITIES, city).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {showWard && (
          <select
            value={ward}
            onChange={handleWardChange}
            className="p-2 rounded-lg border border-border bg-muted focus:ring-2 focus:ring-neon-pink"
          >
            <option value="">Select Ward</option>
            {ensureOption(TOKYO_WARDS, ward).map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        )}
        {showCustomLocation ? (
          <div className="relative w-64">
            <input
              ref={inputRef}
              type="text"
              value={customLocation}
              onChange={handleCustomLocationChange}
              onBlur={handleCustomLocationBlur}
              placeholder="Custom location..."
              className="p-2 rounded-lg border border-border bg-muted focus:ring-2 focus:ring-neon-pink w-full"
              autoFocus
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-background border border-border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {suggestions.map((s, idx) => (
                  <li
                    key={s.display_name + idx}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onMouseDown={() => handleSuggestionSelect(s)}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="p-2 rounded-lg border border-border bg-muted hover:bg-asphalt-grey transition-colors"
            onClick={() => setShowCustomLocation(true)}
            title="Add custom location"
          >
            <Plus size={16} />
          </button>
        )}
        <button
          type="button"
          className="p-2 rounded-lg border border-border bg-muted hover:bg-asphalt-grey transition-colors disabled:opacity-50"
          onClick={handleCurrentLocation}
          title="Use current location"
          disabled={isLoading}
        >
          <LocateFixed size={16} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}; 