import React, { createContext, useContext, useEffect, useState } from 'react';

export interface DeliveryLocation {
  pincode: string;
  city: string;
  state: string;
  formatted: string;
}

interface LocationContextType {
  location: DeliveryLocation;
  updateLocation: (pincode: string, city?: string, state?: string) => boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  getEstimatedDelivery: (daysOffset?: number) => string;
}

const DEFAULT_LOCATION: DeliveryLocation = {
  pincode: '400001',
  city: 'Mumbai',
  state: 'Maharashtra',
  formatted: 'Mumbai 400001',
};

// Common Indian Pincode Map for instant lookup
const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '682001': { city: 'Kochi', state: 'Kerala' },
  '160001': { city: 'Chandigarh', state: 'Punjab' },
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem('bb_delivery_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bb_delivery_location', JSON.stringify(location));
    } catch (e) {
      console.warn('Failed to save location', e);
    }
  }, [location]);

  const updateLocation = (pincode: string, customCity?: string, customState?: string): boolean => {
    const cleaned = pincode.trim().replace(/\D/g, '');
    if (cleaned.length !== 6) {
      return false;
    }

    const matched = PINCODE_MAP[cleaned];
    const city = customCity || (matched ? matched.city : 'Regional Hub');
    const state = customState || (matched ? matched.state : 'India');

    setLocation({
      pincode: cleaned,
      city,
      state,
      formatted: `${city} ${cleaned}`,
    });
    return true;
  };

  const getEstimatedDelivery = (daysOffset: number = 1): string => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        updateLocation,
        isModalOpen,
        setIsModalOpen,
        getEstimatedDelivery,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};
