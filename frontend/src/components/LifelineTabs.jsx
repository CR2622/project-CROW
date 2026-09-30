import React, { useState } from 'react';
import { Zap, Route, Landmark, Shield } from 'lucide-react';
import AlphaTab from './AlphaTab';
import BetaTab from './BetaTab';
import GammaTab from './GammaTab';
import DeltaTab from './DeltaTab';

export default function LifelineTabs({ agentData }) {
  const [activeTab, setActiveTab] = useState('alpha');

  const tabs = [
    { id: 'alpha', label: 'Alpha', icon: Zap },
    { id: 'beta', label: 'Beta', icon: Route },
    { id: 'gamma', label: 'Gamma', icon: Landmark },
    { id: 'delta', label: 'Delta', icon: Shield }
  ];

  return (
    <div className="flex flex-col">
      <div className="flex bg-crow-card border border-crow-border rounded-t-lg overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 border-b-2 transition-colors ${
                isActive 
                  ? 'border-crow-blue text-white bg-[#252a36]' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-[#252a36]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-[#121212] border-x border-b border-crow-border rounded-b-lg">
        {activeTab === 'alpha' && <AlphaTab agentData={agentData} />}
        {activeTab === 'beta' && <BetaTab agentData={agentData} />}
        {activeTab === 'gamma' && <GammaTab agentData={agentData} />}
        {activeTab === 'delta' && <DeltaTab agentData={agentData} />}
      </div>
    </div>
  );
}
