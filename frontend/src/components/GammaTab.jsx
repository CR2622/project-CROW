import React from 'react';
import { Landmark, BadgeCheck } from 'lucide-react';

export default function GammaTab({ agentData }) {
  const actionGamma = agentData?.action_gamma_finance;
  const budget = agentData?.financial_budget;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-xl font-bold border-b border-crow-border pb-2">
        <Landmark className="text-crow-blue w-6 h-6" />
        <span>FINANCIAL ORACLE</span>
      </div>

      {actionGamma ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-crow-green/20 px-4 py-2 rounded-lg text-crow-green font-bold flex items-center space-x-2">
              <BadgeCheck className="w-5 h-5" />
              <span>{actionGamma.action}</span>
            </div>
          </div>

          <div className="bg-crow-card border border-crow-border p-6 rounded-lg text-center">
            <div className="text-sm text-gray-400 mb-1">Amount Authorized</div>
            <div className="text-4xl font-bold text-white mb-2">
              {actionGamma.amount_authorized || '$5,000,000'}
            </div>
            <div className="text-sm text-crow-blue bg-crow-blue/10 inline-block px-3 py-1 rounded-full">
              Recipient: {actionGamma.recipient || 'Municipal Emergency Fund'}
            </div>
          </div>

          {budget && (
            <div className="space-y-3">
              <div className="bg-crow-card border border-crow-border p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Survival Budget Allocation</h4>
                <div className="text-sm text-gray-300">{budget.survival_budget_allocation}</div>
              </div>

              <div className="flex items-center justify-between bg-crow-card border border-crow-border p-4 rounded-lg">
                <span className="font-medium">Micro-Insurance Payout</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${budget.micro_insurance_payout_triggered ? 'bg-crow-green text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {budget.micro_insurance_payout_triggered ? 'TRIGGERED' : 'STANDBY'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-crow-green bg-crow-green/10 p-3 rounded-lg">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Day-Zero Municipal Treasury Funds Released</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-crow-blue p-4 border border-dashed border-crow-blue/30 bg-crow-blue/5 rounded-lg flex flex-col items-center justify-center space-y-2 h-32">
          <div className="font-bold">MONITORING</div>
          <div className="text-sm text-center">Awaiting storm severity threshold...</div>
        </div>
      )}
    </div>
  );
}
