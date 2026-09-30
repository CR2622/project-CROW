import { createContext, useContext, useState } from 'react';

const LOCATIONS = {
  vizag: {
    name: 'Visakhapatnam',
    shortName: 'VIZAG',
    lat: 17.6868,
    lon: 83.2185,
    zoom: 11,
    corridor: 'VISAKHAPATNAM COASTAL CORRIDOR',
    coords: '17.6868°N, 83.2185°E',
  },
  bengal: {
    name: 'Bay of Bengal',
    shortName: 'BENGAL',
    lat: 15.5,
    lon: 84.0,
    zoom: 7,
    corridor: 'BAY OF BENGAL COASTAL CORRIDOR',
    coords: '15.5000°N, 84.0000°E',
  },
};

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [locationKey, setLocationKey] = useState('vizag');
  const location = LOCATIONS[locationKey];

  const switchLocation = (key) => {
    if (LOCATIONS[key]) setLocationKey(key);
  };

  return (
    <LocationContext.Provider value={{ location, locationKey, switchLocation, LOCATIONS }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

export { LOCATIONS };
