import React, { useEffect, useState } from 'react';
import { MOCK_LOADING_STEPS } from '../constants';
import { Activity, Radio, Cpu, Database, CheckCircle2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < MOCK_LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <div className="relative bg-slate-800 p-6 rounded-full border border-slate-700 shadow-2xl">
          <Activity className="w-10 h-10 text-emerald-400 animate-bounce" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">Generating Predictions</h2>
      <p className="text-slate-400 mb-8 max-w-md">GoalKick AI is analyzing live data points to find the highest probability outcomes for today.</p>

      <div className="space-y-4 w-full max-w-md text-left">
        {MOCK_LOADING_STEPS.map((step, idx) => {
          const isActive = idx === stepIndex;
          const isDone = idx < stepIndex;
          
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${
                isActive 
                  ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100 scale-102 shadow-lg shadow-emerald-900/20' 
                  : isDone 
                    ? 'bg-slate-800/50 border-slate-700 text-slate-400' 
                    : 'opacity-40 border-transparent text-slate-600'
              }`}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center border
                ${isActive ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400 animate-pulse' : 
                  isDone ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-600 bg-slate-800'}
              `}>
                {isDone ? <CheckCircle2 className="w-3 h-3" /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-current' : ''}`} />}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};