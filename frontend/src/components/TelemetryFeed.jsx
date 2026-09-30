import React from 'react';
import { Activity, Wind, Gauge, Shield, ServerCrash } from 'lucide-react';

export default function TelemetryFeed({ telemetry }) {
  if (!telemetry) {
    return (
      <div className="bg-crow-card border border-crow-border rounded-lg p-4 text-center text-gray-400">
        Awaiting data...
      </div>
    );
  }

  const windSpeed = telemetry.wind_speed_kmh || 0;
  let windColor = 'text-crow-blue';
  if (windSpeed > 110) windColor = 'text-crow-red';
  else if (windSpeed >= 80) windColor = 'text-crow-yellow';

  return (
    <div className="bg-crow-card border border-crow-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="text-crow-blue w-5 h-5" />
        <h2 className="text-lg font-bold text-white">LIVE TELEMETRY</h2>
        <span className="w-2 h-2 rounded-full bg-crow-blue animate-pulse ml-2"></span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
            <Wind className="w-4 h-4" />
            <span>Wind Speed</span>
          </div>
          <span className={`text-xl font-semibold ${windColor}`}>{windSpeed} km/h</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
            <Gauge className="w-4 h-4" />
            <span>Pressure</span>
          </div>
          <span className="text-xl font-semibold text-white">{telemetry.surface_pressure_hpa || '--'} hPa</span>
        </div>

        {telemetry.vulnerability_score !== undefined && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
              <Shield className="w-4 h-4" />
              <span>Vulnerability</span>
            </div>
            <span className="text-xl font-semibold text-white">{telemetry.vulnerability_score}</span>
          </div>
        )}

        {telemetry.system_degraded && (
          <div className="flex flex-col justify-center text-crow-red">
            <div className="flex items-center space-x-2 font-semibold">
              <ServerCrash className="w-5 h-5" />
              <span>System Degraded</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
