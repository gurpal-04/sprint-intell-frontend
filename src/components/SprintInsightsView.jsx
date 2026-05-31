import React, { useState, useEffect } from 'react';
import { useSprint } from '../context/SprintContext';
import { 
  Layers, 
  GitPullRequest, 
  MessageSquare, 
  CheckCircle2, 
  Circle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function SprintInsightsView() {
  const { sprintData, loading, fetchIssuesData, fetchSlackLogsData } = useSprint();
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    fetchIssuesData();
    fetchSlackLogsData();
  }, []);

  if (loading || !sprintData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded"></div>
        <div className="h-64 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  const { issues, prs, slackLogs } = sprintData;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Normal': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Blocked': return <Circle className="w-4 h-4 text-red-400 fill-red-400/20" />;
      case 'Review': return <Circle className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
      case 'In Progress': return <Circle className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />;
      default: return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Sprint Insights</h1>
        <p className="text-slate-400 text-xs mt-0.5">Explore Linear issue logs, GitHub version files, and conversational updates.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950/65 border border-border w-max">
        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'issues' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Linear Issues ({issues.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('prs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'prs' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>GitHub Pull Requests ({prs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('slack')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'slack' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Slack History ({slackLogs?.length || 0})</span>
        </button>
      </div>

      {/* Dynamic Content Panel */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        {activeTab === 'issues' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400 border-collapse">
              <thead>
                <tr className="border-b border-border text-slate-500 font-semibold bg-slate-950/20">
                  <th className="py-3 px-4">Issue ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Estimate</th>
                  <th className="py-3 px-4 text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issues.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-400">{task.id}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-200">{task.title}</div>
                        <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{task.description}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                        {getStatusIcon(task.state)}
                        <span>{task.state}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">{task.assignee_id.replace('eng_', '@')}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">{task.estimate} pts</td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-500">{task.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'prs' && (
          <div className="overflow-x-auto">
            {prs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-medium">
                No active pull requests matching this filter.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-400 border-collapse">
                <thead>
                  <tr className="border-b border-border text-slate-500 font-semibold bg-slate-950/20">
                    <th className="py-3 px-4">PR #</th>
                    <th className="py-3 px-4">Repo</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Reviewers</th>
                    <th className="py-3 px-4">Lines Diff</th>
                    <th className="py-3 px-4">Stale Open</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {prs.map((pr) => (
                    <tr key={pr.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-indigo-400">#{pr.number}</td>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{pr.repo}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            {pr.title}
                            {pr.status === 'Merged' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase">
                                Merged
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Author: {pr.authorId.replace('eng_', '@')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          {pr.reviewers.map(r => (
                            <span key={r} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px]">
                              {r.replace('eng_', '@')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px]">
                        <span className="text-emerald-500">+{pr.linesAdded || 0}</span>
                        <span className="text-slate-500"> / </span>
                        <span className="text-red-500">-{pr.linesRemoved || 0}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{pr.staleHours || 0} hrs</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a 
                          href="#chat" 
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 font-semibold hover:text-indigo-300"
                        >
                          <span>Audit</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'slack' && (
          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto bg-slate-950/20">
            {!slackLogs || slackLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-medium">
                No real-time Slack messages found.
              </div>
            ) : (
              slackLogs.map((log, idx) => (
                <div key={idx} className="flex gap-4 p-3.5 rounded-xl bg-slate-900/40 border border-border/40 hover:border-indigo-500/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 font-mono shadow-sm">
                    {String(log.sender || "@U").substring(1, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{log.sender || "unknown"}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                          {log.channel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "now"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{log.message}</p>
                    
                    {/* Correlation Badge */}
                    {log.message && (log.message.includes("PR-") || log.message.includes("deployment")) && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-semibold font-mono">
                          <Clock className="w-3 h-3" />
                          Correlated to GitHub PR
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
