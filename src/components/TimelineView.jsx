import React from 'react';
import { useSprint } from '../context/SprintContext';
import { 
  GitPullRequest, 
  MessageSquare, 
  Layers, 
  Cpu, 
  Info,
  Clock
} from 'lucide-react';

export default function TimelineView() {
  const { sprintData, loading } = useSprint();

  if (loading || !sprintData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded"></div>
        <div className="h-96 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  const { timeline } = sprintData;

  const getSourceIcon = (source) => {
    switch (source) {
      case 'GitHub': return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case 'Slack': return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'Linear': return <Layers className="w-4 h-4 text-blue-400" />;
      default: return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSourceStyle = (source) => {
    switch (source) {
      case 'GitHub': return 'bg-purple-500/10 border-purple-500/20';
      case 'Slack': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'Linear': return 'bg-blue-500/10 border-blue-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Timeline Correlation</h1>
        <p className="text-slate-400 text-xs mt-0.5">Visually connect cross-system events (PR merge → staging deploy → build failure → Slack triage).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Vertical Timeline */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-6 relative overflow-hidden">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-200">System Logs Linkage</h3>
            <p className="text-[11px] text-slate-400">Time-series cross-platform correlation logs for Sprint 24.</p>
          </div>

          {timeline.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500 font-medium">
              No recent cross-system logs correlated.
            </div>
          ) : (
            <div className="relative border-l border-slate-800/80 ml-4 pl-8 py-4 space-y-8">
              {timeline.map((ev, index) => {
                const isSeverityHigh = ev.severity === 'High' || ev.severity === 'Critical';
                return (
                  <div key={ev.id} className="relative group">
                    {/* Node Dot Icon */}
                    <div className={`absolute -left-12 top-0.5 w-8 h-8 rounded-xl border flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 ${getSourceStyle(ev.source)} ${isSeverityHigh ? 'animate-pulse' : ''}`}>
                      {getSourceIcon(ev.source)}
                    </div>

                    {/* Timeline Log Bubble */}
                    <div className={`p-4 rounded-2xl bg-slate-900/35 border border-slate-800/40 hover:border-slate-700 transition-all ${
                      isSeverityHigh ? 'border-red-500/15 bg-red-500/5' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                            {ev.source}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">•</span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {ev.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase font-mono">
                            {ev.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 mt-2">{ev.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ev.description}</p>
                      
                      {ev.link && (
                        <div className="mt-2.5 flex items-center gap-1 text-[10px] text-indigo-400 font-semibold font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Linked item: {ev.link}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informative Side Panel explaining cause-and-effect */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Info className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-slate-200">How Correlation Works</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Standard chatbots evaluate information as standalone documents. The **Sprint Operations Agent** tracks temporal indices across Linear tasks, GitHub repositories, and Slack channels concurrently.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex gap-3 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-slate-200">Temporal indexing</h4>
                  <p className="text-[11px] text-slate-500">Maps events to a highly precise timeline coordinate system.</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-slate-200">Semantic clustering</h4>
                  <p className="text-[11px] text-slate-500">Pairs chat inquiries with related ticket codes (e.g. LIN-108) and commit history hashes.</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-slate-200">Causal links</h4>
                  <p className="text-[11px] text-slate-500">Highlights cause-and-effect paths dynamically based on active issues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
