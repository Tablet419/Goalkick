import React, { useState } from 'react';
import { generatePredictions, generateZeroZeroPredictions } from './services/geminiService';
import { Prediction, PredictionState } from './types';
import { PredictionCard } from './components/PredictionCard';
import { LoadingScreen } from './components/LoadingScreen';
import { Zap, ShieldCheck, AlertCircle, RefreshCw, Trophy, Target, Lock } from 'lucide-react';

export default function App() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [status, setStatus] = useState<PredictionState>(PredictionState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'STANDARD' | 'SNIPER'>('STANDARD');

  const handleGenerate = async (selectedMode: 'STANDARD' | 'SNIPER') => {
    setStatus(PredictionState.LOADING);
    setMode(selectedMode);
    setError(null);
    try {
      let results;
      if (selectedMode === 'SNIPER') {
        results = await generateZeroZeroPredictions();
      } else {
        results = await generatePredictions();
      }
      setPredictions(results);
      setStatus(PredictionState.SUCCESS);
    } catch (err) {
      setError((err as Error).message);
      setStatus(PredictionState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg shadow-emerald-900/20">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              GoalKick AI
            </h1>
            <p className="text-emerald-400 text-sm font-bold tracking-wide flex items-center gap-1">
              <Zap className="w-3 h-3" />
              95% ACCURACY ENGINE
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800/50 p-2 pr-6 rounded-full border border-slate-700">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xs">
            <div className="text-slate-400">System Status</div>
            <div className="text-emerald-400 font-semibold">Live Analysis Active</div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        
        {/* IDLE STATE */}
        {status === PredictionState.IDLE && (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Unlock Elite <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Soccer Predictions
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Our AI analyzes thousands of data points including H2H, player form, and tactical matchups.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              {/* Standard Analysis Button */}
              <button 
                onClick={() => handleGenerate('STANDARD')}
                className="w-full md:w-auto group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
              >
                <span className="flex items-center justify-center gap-3">
                  Start Standard Analysis
                  <Zap className="w-5 h-5 group-hover:text-white transition-colors" />
                </span>
              </button>

              {/* 0-0 Sniper Button */}
              <button 
                onClick={() => handleGenerate('SNIPER')}
                className="w-full md:w-auto group relative px-8 py-4 bg-slate-800 hover:bg-indigo-900/40 border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 hover:text-white font-bold text-lg rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/20"
              >
                <span className="flex items-center justify-center gap-3">
                  First Half 0:0 Sniper
                  <Target className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
                </span>
                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                  99% ACCURACY
                </div>
              </button>
            </div>
            
            <p className="mt-6 text-xs text-slate-500 font-medium">
              <Lock className="w-3 h-3 inline-block mr-1" />
              Secure live connection to global sports data
            </p>
          </div>
        )}

        {/* LOADING STATE */}
        {status === PredictionState.LOADING && (
          <LoadingScreen />
        )}

        {/* ERROR STATE */}
        {status === PredictionState.ERROR && (
          <div className="text-center py-20 bg-red-500/5 border border-red-500/20 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
            <p className="text-slate-400 mb-6">{error || "Unable to connect to prediction engine."}</p>
            <button 
              onClick={() => handleGenerate(mode)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Analysis
            </button>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === PredictionState.SUCCESS && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    {mode === 'SNIPER' ? (
                      <>
                        <Target className="w-5 h-5 text-indigo-400" />
                        <span className="text-indigo-200">First Half 0:0 Locks</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 text-emerald-400" />
                        <span>Today's Top Picks</span>
                      </>
                    )}
                  </h3>
                  {mode === 'SNIPER' && (
                    <p className="text-xs text-indigo-400/80 mt-1">
                      High-probability defensive standoffs identified.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setStatus(PredictionState.IDLE)} 
                    className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Back to Home
                  </button>
                  <button 
                    onClick={() => handleGenerate(mode)} 
                    className="text-xs px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
             </div>
             
             <div className="grid gap-6">
                {predictions.map((prediction, index) => (
                  <PredictionCard key={prediction.id} prediction={prediction} index={index} />
                ))}
             </div>

             <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 text-center">
                <p className="text-slate-500 text-xs leading-relaxed">
                  Disclaimer: Predictions are generated by AI based on statistical analysis. 
                  Sports outcomes are unpredictable. Please bet responsibly. 
                  {mode === 'SNIPER' ? '99% accuracy target refers to historical model performance on defensive metrics.' : 'Historical accuracy does not guarantee future results.'}
                </p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}