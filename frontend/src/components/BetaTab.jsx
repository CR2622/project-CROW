import React from 'react';
import { Route, AlertTriangle, Hospital, MapPin, Navigation } from 'lucide-react';

export default function BetaTab({ agentData }) {
  const actionBeta = agentData?.action_beta_medevac;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-xl font-bold border-b border-crow-border pb-2">
        <Route className="text-crow-blue w-6 h-6" />
        <span>MEDICAL EVACUATION PROTOCOL</span>
      </div>

      {actionBeta ? (
        <div className="space-y-4">
          <div className="inline-block px-4 py-2 bg-crow-border rounded-lg text-lg font-bold">
            STATUS: <span className={actionBeta.action === 'EVACUATE' ? 'text-crow-yellow' : 'text-crow-blue'}>{actionBeta.action}</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">At-Risk Hospitals</h3>
            {(actionBeta.at_risk_hospitals || []).map((hospital, i) => (
              <div key={i} className="flex items-center space-x-3 bg-crow-card p-3 rounded-lg border border-crow-border">
                <div className="bg-crow-yellow/20 p-2 rounded-full">
                  <AlertTriangle className="text-crow-yellow w-5 h-5" />
                </div>
                <Hospital className="text-gray-400 w-5 h-5" />
                <span className="font-medium">{hospital}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-300">Inland Safe Zone</h3>
            <div className="flex items-center space-x-3 bg-crow-card p-3 rounded-lg border border-crow-border">
              <MapPin className="text-crow-green w-5 h-5" />
              <span className="font-medium">{actionBeta.inland_safe_zone || 'Anakapalle'}</span>
            </div>
          </div>

          <div className="bg-crow-card border border-crow-yellow p-4 rounded-lg flex items-start space-x-4 mt-4">
            <Navigation className="text-crow-yellow w-6 h-6 mt-1" />
            <div>
              <h3 className="font-bold text-crow-yellow mb-1">Evacuation Route Active</h3>
              <p className="text-sm text-gray-300">
                {actionBeta.evacuation_route || 'Proceed via NH-16 North towards Anakapalle.'}
              </p>
            </div>
          </div>

          {agentData?.evacuation_plan && (
            <div className="bg-crow-blue/10 border border-crow-blue/30 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-crow-blue mb-2">Detailed Plan</h4>
              <p className="text-sm whitespace-pre-wrap">{agentData.evacuation_plan}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400 p-4 border border-dashed border-crow-border rounded-lg">
          No active Med-Evac protocols
        </div>
      )}
    </div>
  );
}
