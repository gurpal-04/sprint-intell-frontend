import React, { useState } from 'react';
import { Layers, GitPullRequest, MessageSquare, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SettingsView() {
  const [integrations, setIntegrations] = useState({
    linear: true,
    github: true,
    slack: true,
    notion: false
  });

  const toggle = (key) => {
    setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const channels = [
    { key: 'linear', label: 'Linear Integration', desc: 'Sync sprint backlogs, overdue tickets, story points, and task statuses.', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'github', label: 'GitHub Version Control', desc: 'Monitor branch updates, open pull requests, stale reviews, and lines changed.', icon: GitPullRequest, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { key: 'slack', label: 'Slack Operations Chat', desc: 'Index developer chats, sick notice logs, incident triaging, and general team updates.', icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { key: 'notion', label: 'Notion Documentation Layer', desc: 'Index software architectural notes, product specification sheets, and onboarding files.', icon: ShieldCheck, color: 'text-slate-400', bg: 'bg-slate-500/10' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Integrations & Settings</h1>
        <p className="text-slate-400 text-xs mt-0.5">Toggle active enterprise communication channels and indexing services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((chan) => {
          const Icon = chan.icon;
          const isActive = integrations[chan.key];
          return (
            <div 
              key={chan.key}
              className={`glass-card p-6 rounded-2xl flex justify-between items-start transition-all ${
                isActive ? 'border-indigo-500/20' : 'opacity-70'
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border border-border flex-shrink-0 ${chan.bg} ${chan.color}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-100">{chan.label}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">{chan.desc}</p>
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold mt-2 font-mono ${
                    isActive ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                    {isActive ? 'Connected & Indexed' : 'Disabled'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => toggle(chan.key)}
                className="text-slate-500 hover:text-indigo-400 transition-all flex-shrink-0"
              >
                {isActive ? (
                  <ToggleRight className="w-8 h-8 text-indigo-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
