import React, { useState, useEffect } from 'react';
import { Prediction } from '../types';
import { ChevronDown, ChevronUp, Trophy, Calendar, TrendingUp, History, Target, Info } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  index: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimateBar(true), 100 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  // Dynamic style based on confidence
  const getConfidenceStyle = (score: number) => {
    if (score >= 90) return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/30',
      shadow: 'shadow-emerald-500/20'
    };
    if (score >= 80) return {
      text: 'text-blue-400',
      bg: 'bg-blue-500',
      border: 'border-blue-500/30',
      shadow: 'shadow-blue-500/20'
    };
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500',
      border: 'border-amber-500/30',
      shadow: 'shadow-amber-500/20'
    };
  };

  const styles = getConfidenceStyle(prediction.confidence);

  return (
    <div 
      className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-emerald-900/20 hover:border-slate-600"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Card Header / Main Info */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3 h-3" />
            <span>{prediction.league}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{prediction.matchTime}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white leading-tight">{prediction.homeTeam}</h3>
          </div>
          <div className="px-4 text-slate-500 font-bold text-sm">VS</div>
          <div className="flex-1 text-right">
            <h3 className="text-lg font-bold text-white leading-tight">{prediction.awayTeam}</h3>
          </div>
        </div>

        {/* Prediction & Confidence Section */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 flex flex-wrap justify-between items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">AI Prediction</p>
            <p className={`text-xl font-bold flex items-center gap-2 ${styles.text}`}>
              <Target className="w-5 h-5" />
              {prediction.predictionMarket}
            </p>
          </div>
          
          <div className="flex flex-col items-end w-full sm:w-auto min-w-[140px]">
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</span>
               <span className={`text-2xl font-bold leading-none ${styles.text}`}>{prediction.confidence}%</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
               <div 
                  className={`h-full rounded-full ${styles.bg} shadow-lg ${styles.shadow} transition-all duration-1000 ease-out`} 
                  style={{ width: animateBar ? `${prediction.confidence}%` : '0%' }} 
               />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Analysis Section */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 bg-slate-800/80 border-t border-slate-700 hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 text-sm text-slate-300 font-medium"
      >
        {isExpanded ? 'Hide Analysis' : 'View Full Analysis'}
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" /> }
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 bg-slate-900/30 border-t border-slate-800/50 animate-in slide-in-from-top-2 duration-200">
          <div className="grid gap-4 mt-2">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Reasoning</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed pl-6">
                {prediction.reasoning}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                <History className="w-4 h-4 text-blue-500" />
                <span>Head-to-Head & Standings</span>
              </div>
              <div className="pl-6 space-y-2">
                <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">H2H: </span> {prediction.h2hSummary}
                </div>
                <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Table: </span> {prediction.standingsSummary}
                </div>
              </div>
            </div>

            {prediction.groundingUrls.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                 <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                   <Info className="w-3 h-3" /> Sources
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {prediction.groundingUrls.map((url, i) => (
                     <a 
                      key={i} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline truncate max-w-[200px]"
                    >
                      Source {i + 1}
                     </a>
                   ))}
                 </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};