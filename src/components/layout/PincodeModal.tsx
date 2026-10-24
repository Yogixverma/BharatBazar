import React, { useState } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const METRO_CITIES = [
  { city: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { city: 'New Delhi', pincode: '110001', state: 'Delhi' },
  { city: 'Bengaluru', pincode: '560001', state: 'Karnataka' },
  { city: 'Hyderabad', pincode: '500001', state: 'Telangana' },
  { city: 'Chennai', pincode: '600001', state: 'Tamil Nadu' },
  { city: 'Kolkata', pincode: '700001', state: 'West Bengal' },
  { city: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { city: 'Ahmedabad', pincode: '380001', state: 'Gujarat' },
];

export const PincodeModal: React.FC = () => {
  const { location, updateLocation, isModalOpen, setIsModalOpen } = useLocation();
  const [customPincode, setCustomPincode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = updateLocation(customPincode);
    if (success) {
      setIsModalOpen(false);
      setCustomPincode('');
    } else {
      setError('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleSelectCity = (pincode: string, city: string, state: string) => {
    updateLocation(pincode, city, state);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-gray-200">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-full">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Choose your location</h3>
            <p className="text-xs text-gray-500">
              Select a delivery location to see product availability and delivery options
            </p>
          </div>
        </div>

        {/* Current Location */}
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-500 block">Current delivery address:</span>
            <span className="font-semibold text-gray-800 text-sm">
              {location.city}, {location.state} - {location.pincode}
            </span>
          </div>
          <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
            <Check className="w-3 h-3" /> Active
          </span>
        </div>

        {/* Custom Pincode Input */}
        <form onSubmit={handleApply} className="mb-5">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Enter an Indian PIN Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={customPincode}
              onChange={(e) => {
                setError(null);
                setCustomPincode(e.target.value.replace(/\D/g, ''));
              }}
              placeholder="e.g. 560001"
              className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-4 py-2 rounded-md text-sm cursor-pointer shadow-xs"
            >
              Apply
            </button>
          </div>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </form>

        {/* Fast Metro Cities */}
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            Popular Cities & Hubs
          </span>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {METRO_CITIES.map((c) => (
              <button
                key={c.pincode}
                type="button"
                onClick={() => handleSelectCity(c.pincode, c.city, c.state)}
                className={`text-left p-2.5 rounded-md border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  location.pincode === c.pincode
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-medium'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-900">{c.city}</div>
                  <div className="text-[11px] text-gray-500">{c.pincode}</div>
                </div>
                {location.pincode === c.pincode && (
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
