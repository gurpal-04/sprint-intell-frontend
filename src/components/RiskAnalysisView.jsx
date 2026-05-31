import React, { useEffect } from 'react';
import { useSprint } from '../context/SprintContext';
import { 
  AlertOctagon, 
  HelpCircle, 
  Zap, 
  ShieldAlert, 
  CheckCircle,
  MessageSquare,
  History
} from 'lucide-react';

export default function RiskAnalysisView() {
  const { sprintData, loading, fetchBlockersData } = useSprint();

  useEffect(() => {
    fetchBlockersData();
  }, []);

  if (loading || !sprintData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded"></div>
        <div className="h-44 bg-slate-800 rounded-2xl"></div>
        <div className="h-44 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  const { blockers } = sprintData;

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk Analysis</h1>
          <p className="text-slate-400 text-xs mt-0.5">Automated Silent Blocker Identification & Dependency Vulnerability Scanning.</p>
        </div>
        <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-lg flex items-center gap-1.5 font-mono">
          <History className="w-3.5 h-3.5" />
          Real-time auditing active
        </span>
      </div>

      {blockers.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">No Operations Blocks Flagged</h3>
          <p className="text-xs text-slate-500 max-w-sm">All task timelines, code reviews, staging metrics, and developer communications are healthy.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {blockers.map((blk) => (
            <div 
              key={blk.id} 
              className={`glass-card p-6 rounded-2xl border-l-4 relative overflow-hidden ${
                blk.severity === 'Critical' ? 'border-l-red-500' : 'border-l-amber-500'
              }`}
            >
              {/* Top Row: Type & Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className={`w-4 h-4 ${blk.severity === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">{blk.type}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getSeverityBadge(blk.severity)}`}>
                  {blk.severity} Severity
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-slate-100 mt-2.5">{blk.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{blk.reason}</p>

              {/* Cross System Correlation Detail Panel */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/45 border border-slate-900 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Cross-System Correlation Logs</span>
                  <p className="text-xs font-mono text-slate-300 italic mt-0.5 leading-relaxed">{blk.crossContext}</p>
                </div>
              </div>

              {/* Action Plan */}
              <div className="mt-4 pt-4 border-t border-border flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Suggested Mitigation Action Plan</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">{blk.suggestedAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
