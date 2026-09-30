import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useLocation } from '../context/LocationContext';

// Component to re-center map when location changes
function MapUpdater() {
  const { location } = useLocation();
  const map = useMap();
  
  useEffect(() => {
    map.setView([location.lat, location.lon], location.zoom, { animate: true });
  }, [location, map]);
  
  return null;
}

export default function MapPanel({ agentData }) {
  const { location } = useLocation();
  
  const substations = [
    { name: "Gajuwaka 400kV", coords: [17.7049, 83.2121] },
    { name: "Duvvada 220kV", coords: [17.7284, 83.1504] },
    { name: "Pendurthi 132kV", coords: [17.7518, 83.1878] },
    { name: "Steel Plant 400kV", coords: [17.6380, 83.1664] }
  ];

  const hospitals = [
    { name: "King George Hospital", coords: [17.7215, 83.3058], type: "hospital" },
    { name: "GITAM Hospital", coords: [17.7529, 83.3771], type: "hospital" },
    { name: "Anakapalle Safe Zone", coords: [17.6910, 83.0040], type: "safezone" }
  ];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={[location.lat, location.lon]} zoom={location.zoom} style={{ height: '100%', width: '100%' }}>
        <MapUpdater />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {agentData?.action_alpha_grid && substations.map((sub, idx) => (
          <CircleMarker
            key={`sub-${idx}`}
            center={sub.coords}
            pathOptions={{ color: '#EA4335', fillColor: '#EA4335', fillOpacity: 0.7 }}
            radius={8}
          >
            <Popup className="text-black">{sub.name}</Popup>
          </CircleMarker>
        ))}

        {agentData?.action_beta_medevac && hospitals.map((site, idx) => (
          <CircleMarker
            key={`hosp-${idx}`}
            center={site.coords}
            pathOptions={{ 
              color: site.type === 'hospital' ? '#FBBC05' : '#34A853', 
              fillColor: site.type === 'hospital' ? '#FBBC05' : '#34A853', 
              fillOpacity: 0.7 
            }}
            radius={8}
          >
            <Popup className="text-black">{site.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
