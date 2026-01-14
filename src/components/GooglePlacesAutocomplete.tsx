'use client'
import React, { useState, useRef, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string, location?: { lat: number; lng: number }) => void;
  placeholder?: string;
  label?: string;
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Buscar dirección...',
  label = 'Dirección'
}) => {
  const { isLoaded, loadError } = useJsApiLoader();

  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const placesRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPredictions = useCallback((input: string) => {
    if (!isLoaded || !input) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    if (!autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.AutocompleteService();
    }

    autocompleteRef.current.getPlacePredictions(
      { input },
      (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
        } else {
          setPredictions([]);
        }
        setIsLoading(false);
      }
    );
  }, [isLoaded]);

  const getPlaceDetails = useCallback((placeId: string) => {
    if (!isLoaded) return;

    if (!placesRef.current) {
      placesRef.current = new google.maps.places.PlacesService(document.createElement('div'));
    }

    placesRef.current.getDetails(
      { placeId },
      (place: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          const address = place.formatted_address || place.name || '';
          onChange(address, location);
        }
        setPredictions([]);
      }
    );
  }, [isLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    fetchPredictions(value);
  };

  if (loadError) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
          <input
            type="text"
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-red-300 rounded-2xl focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            placeholder="Error cargando Google Maps - verifica tu API Key"
            disabled
          />
        </div>
        <p className="mt-2 text-sm text-red-600">
          Error al cargar Google Maps. Verifica que NEXT_PUBLIC_GOOGLE_MAPS_KEY esté configurado en .env.local
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={value}
            disabled
            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl opacity-60"
            placeholder={placeholder}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => getPlaceDetails(prediction.place_id)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting?.main_text}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting?.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
