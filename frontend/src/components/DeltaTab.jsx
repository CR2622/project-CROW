import React, { useState } from 'react';
import { Shield, Zap, CheckCircle, Smartphone, Loader, Save, X } from 'lucide-react';
import { simulateOutage } from '../utils/api';
import { usePhone } from '../context/PhoneContext';

export default function DeltaTab({ agentData }) {
  const homeTasks = agentData?.home_hardening_tasks || [];
  const { phone: savedPhone, isRegistered, registerPhone, clearPhone } = usePhone();
  const [phoneInput, setPhoneInput] = useState(savedPhone || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);
    const res = await simulateOutage(phoneInput || savedPhone);
    setResult(res);
    setLoading(false);
  };

  const handleSavePhone = () => {
    if (phoneInput.trim()) {
      registerPhone(phoneInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-xl font-bold border-b border-crow-border pb-2">
        <Shield className="text-crow-blue w-6 h-6" />
        <span>OFFLINE GUARDIAN</span>
      </div>

      {/* Phone Registration */}
      <div className="bg-crow-card border border-crow-border rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-crow-blue" />
          <h3 className="font-bold">DEVICE SYNC</h3>
          {isRegistered && (
            <span className="text-xs bg-crow-green/20 text-crow-green px-2 py-0.5 rounded-full">SYNCED</span>
          )}
        </div>
        <p className="text-xs text-gray-400">
          Register your phone number to receive SMS evacuation alerts when network connectivity is lost.
        </p>
        <div className="flex space-x-2">
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="flex-1 bg-[#121212] border border-crow-border rounded px-4 py-2 text-white text-sm focus:outline-none focus:border-crow-blue"
          />
          <button
            onClick={handleSavePhone}
            className="bg-crow-blue hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors flex items-center space-x-1"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Sync</span>
          </button>
          {isRegistered && (
            <button
              onClick={() => { clearPhone(); setPhoneInput(''); }}
              className="bg-crow-border hover:bg-gray-600 text-gray-300 px-2 py-2 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Home Hardening Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">HOME HARDENING INSTRUCTIONS (FALLBACK)</h3>
        {homeTasks.length > 0 ? (
          <div className="space-y-2">
            {homeTasks.map((task, i) => (
              <div key={i} className="flex items-start space-x-3 bg-crow-card p-3 rounded-lg border border-crow-border">
                <CheckCircle className="text-gray-400 w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Waiting for instructions...</div>
        )}
      </div>

      {/* SMS Fallback Simulation */}
      <div className="border-t border-crow-border pt-6 mt-6 space-y-4">
        <h3 className="text-lg font-bold">SMS FALLBACK SIMULATION</h3>
        <p className="text-sm text-gray-400">
          In the event of a catastrophic 5G tower collapse, Project CROW shifts to SMS-based
          offline fallback for critical telemetry and survival protocol broadcasting.
        </p>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-2 bg-crow-red hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-colors ${
            !loading ? 'animate-pulse-red shadow-[0_0_10px_#EA4335]' : 'opacity-70'
          }`}
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          <span>{loading ? 'SIMULATING...' : '⚡ SIMULATE 5G TOWER COLLAPSE'}</span>
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-lg border ${result.sms_dispatched ? 'bg-crow-green/10 border-crow-green' : 'bg-crow-red/10 border-crow-red'}`}>
          <h4 className="font-bold mb-1">
            {result.sms_dispatched ? '✅ SMS Dispatched Successfully' : '❌ Dispatch Failed (Mock Mode)'}
          </h4>
          <pre className="text-xs overflow-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
