import React from 'react';
import { useSprint } from '../context/SprintContext';
import { Cpu, RefreshCw, AlertCircle } from 'lucide-react';

export default function Header() {
  const { sprintData, fetchSprintData, error, loading } = useSprint();

  return (
    <header className="h-20 bg-card/45 border-b border-border backdrop-blur-md flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      {/* Active Sprint Metadata */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/10 text-indigo-300 font-mono font-medium px-2 py-0.5 rounded border border-indigo-500/20">
              Sprint 1
            </span>
            <span className="text-slate-500 text-xs">|</span>
            <span className="text-slate-400 text-xs font-medium">May 26 - June 2</span>
          </div>
          <h2 className="text-sm font-semibold text-gray-200 mt-0.5 truncate max-w-[280px]">
            {sprintData?.scenarioDescription || "Sprint Intelligence Control"}
          </h2>
        </div>
      </div>

      {/* Connection & Layer Status */}
      <div className="flex items-center gap-4">
        {/* Manual Refresh Trigger */}
        <button
          onClick={fetchSprintData}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/25 transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>

        {/* {error ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono font-medium text-[10px]">API OFFLINE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono font-medium text-[10px]">API ACTIVE</span>
          </div>
        )} */}
      </div>
    </header>
  );
}
