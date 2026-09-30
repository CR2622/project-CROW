import React, { useState } from 'react';
import { Bird, MapPin, AlertTriangle, Siren, ChevronDown } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export default function Header({ alertStatus, isCritical, connectionStatus }) {
  const { location, locationKey, switchLocation, LOCATIONS } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-crow-bg border-b border-crow-border flex flex-col md:flex-row items-center justify-between p-4 min-h-[64px]">
      <div className="flex items-center space-x-2 text-white font-bold text-lg mb-2 md:mb-0">
        <Bird className="text-crow-blue w-6 h-6" />
        <span>PROJECT CROW</span>
      </div>

      <div className="relative flex items-center space-x-2 text-gray-300 text-sm mb-2 md:mb-0">
        <MapPin className="text-gray-400 w-4 h-4" />
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-1 hover:text-white transition-colors bg-crow-card border border-crow-border rounded px-3 py-1"
        >
          <span>{location.coords} | {location.corridor}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {showDropdown && (
          <div className="absolute top-full mt-1 left-0 bg-crow-card border border-crow-border rounded-lg shadow-lg z-50 min-w-[280px]">
            {Object.entries(LOCATIONS).map(([key, loc]) => (
              <button
                key={key}
                onClick={() => { switchLocation(key); setShowDropdown(false); }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-[#252a36] transition-colors flex items-center justify-between ${
                  locationKey === key ? 'text-crow-blue' : 'text-gray-300'
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                <div>
                  <div className="font-semibold">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.coords}</div>
                </div>
                {locationKey === key && <span className="w-2 h-2 rounded-full bg-crow-blue"></span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {connectionStatus === 'connected' && <span className="w-2 h-2 rounded-full bg-crow-green"></span>}
          {connectionStatus === 'connecting' && <span className="w-2 h-2 rounded-full bg-crow-yellow animate-pulse"></span>}
          {(connectionStatus === 'disconnected' || connectionStatus === 'error') && <span className="w-2 h-2 rounded-full bg-crow-red"></span>}
          <span className="text-xs text-gray-400 capitalize">{connectionStatus}</span>
        </div>

        {isCritical ? (
          <div className="flex items-center space-x-2 bg-crow-red text-white px-3 py-1 rounded-full animate-pulse-critical shadow-[0_0_10px_#EA4335]">
            <Siren className="w-4 h-4" />
            <span className="text-sm font-bold">PRE-LANDFALL INITIATED</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-crow-yellow text-crow-bg px-3 py-1 rounded-full">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">STORM BREWING</span>
          </div>
        )}
      </div>
    </header>
  );
}
