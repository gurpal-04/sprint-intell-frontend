import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Activity, 
  Settings, 
  Terminal
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Sprint Insights', icon: Layers },
    // { id: 'coral-sql', label: 'Coral SQL Sandbox', icon: Terminal },
    { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'workload', label: 'Team Workload', icon: Users },
    { id: 'chat', label: 'AI Chat Ops', icon: MessageSquare },
    { id: 'timeline', label: 'Timeline Correlation', icon: Activity },
    { id: 'settings', label: 'Integrations', icon: Settings },
  ];


  return (
    <aside className="w-64 bg-card/60 border-r border-border backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow neon-glow-indigo">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold font-sans text-white text-base tracking-tight leading-tight">Sprint Intel</h1>
          <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Ops Agent V1.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600/25 to-purple-600/10 text-indigo-200 border-l-[3px] border-indigo-500 pl-[13px] glass-panel shadow-sm shadow-indigo-500/5' 
                  : 'text-muted hover:text-gray-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="p-4 border-t border-border bg-slate-950/30 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Coral Retrieval Layer
        </span>
        <span className="font-mono text-[10px]">v1.0.2</span>
      </div>
    </aside>
  );
}
