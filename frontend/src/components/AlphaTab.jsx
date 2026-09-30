import React from 'react';
import { Zap, CheckCircle } from 'lucide-react';

export default function AlphaTab({ agentData }) {
  const actionAlpha = agentData?.action_alpha_grid;
  const homeTasks = agentData?.home_hardening_tasks || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-xl font-bold border-b border-crow-border pb-2">
        <Zap className="text-crow-blue w-6 h-6" />
        <span>GRID-LOCK PROTOCOL</span>
      </div>

      {actionAlpha ? (
        <div className="space-y-4">
          <div className="inline-block px-4 py-2 bg-crow-border rounded-lg text-lg font-bold">
            STATUS: <span className={actionAlpha.action === 'SHUTDOWN' ? 'text-crow-red' : 'text-crow-green'}>{actionAlpha.action}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(actionAlpha.target_substations || []).map((sub, i) => (
              <div key={i} className="p-4 bg-crow-card border border-crow-border rounded-lg flex flex-col space-y-2">
                <span className="font-semibold text-white">{sub}</span>
                {actionAlpha.action === 'SHUTDOWN' ? (
                  <span className="text-xs bg-crow-red text-white px-2 py-1 rounded inline-block w-max animate-pulse-red">
                    TRIP BREAKER ENGAGED
                  </span>
                ) : (
                  <span className="text-xs bg-crow-green text-white px-2 py-1 rounded inline-block w-max">
                    STANDBY
                  </span>
                )}
              </div>
            ))}
          </div>

          {actionAlpha.reason && (
            <div className="text-sm text-gray-400 bg-crow-card border border-crow-border p-3 rounded-lg">
              <span className="font-semibold text-gray-300">Reason: </span>{actionAlpha.reason}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-32 h-10 bg-crow-card border border-crow-border rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-crow-card border border-crow-border rounded-lg animate-pulse"></div>
            <div className="h-24 bg-crow-card border border-crow-border rounded-lg animate-pulse"></div>
          </div>
        </div>
      )}

      {homeTasks.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold">HOME HARDENING TASKS</h3>
          <div className="space-y-2">
            {homeTasks.map((task, i) => (
              <div key={i} className="flex items-start space-x-3 bg-crow-card p-3 rounded-lg border border-crow-border">
                <CheckCircle className="text-crow-green w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
