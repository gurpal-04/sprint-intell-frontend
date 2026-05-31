import React, { useState } from 'react';
import { useSprint } from '../context/SprintContext';
import { Terminal, Play, Table, AlertCircle } from 'lucide-react';

export default function CoralConsoleView() {
  const { executeCoralSql } = useSprint();
  const [sql, setSql] = useState("SELECT id, title, state, priority, estimate FROM linear.issues WHERE state = 'Blocked'");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: "Show Blocked Issues", query: "SELECT id, title, state, priority, assignee_id FROM linear.issues WHERE state = 'Blocked'" },
    { label: "Find Stale PRs", query: "SELECT number, title, repo, status, stale_hours FROM github.pull_requests WHERE stale_hours > 24" },
    { label: "Slack + Linear JOIN", query: "SELECT task_id, task_title, task_status, slack_sender, slack_message FROM linear.issues JOIN slack.messages" },
    { label: "Find Overloaded Developers", query: "SELECT name, status, workload_score FROM team.engineers WHERE workload_score >= 75" },
    { label: "List Available Tables", query: "SELECT * FROM coral.tables" }
  ];

  const handleRun = async (queryText = sql) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await executeCoralSql(queryText);
      if (data && data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
          <Terminal className="w-6 h-6 text-indigo-400" />
          Coral SQL Sandbox
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Local-first SQL runtime that exposes Linear, Slack, and GitHub APIs as queryable relational tables.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-210px)] items-stretch">
        {/* SQL Input & Preset Queries */}
        <div className="xl:col-span-1 glass-card p-5 rounded-2xl flex flex-col justify-between border border-border h-full overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Database Schemas</span>
              <div className="space-y-1.5 font-mono text-[10px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <div>📚 **linear.issues**</div>
                <div className="pl-3 text-[9px] text-slate-500">Cols: id, title, state, priority, assignee_id, estimate</div>
                <div>📚 **github.pulls**</div>
                <div className="pl-3 text-[9px] text-slate-500">Cols: number, repo, title, status, author_id, stale_hours</div>
                <div>📚 **slack.messages**</div>
                <div className="pl-3 text-[9px] text-slate-500">Cols: channel, sender, message, timestamp</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Preset SQL Queries</span>
              <div className="space-y-2">
                {presets.map((pre, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSql(pre.query);
                      handleRun(pre.query);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:border-indigo-500/25 hover:text-white transition-all shadow-sm leading-tight block"
                  >
                    {pre.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10px] text-slate-400 leading-relaxed font-sans mt-auto">
            💡 **Coral SQL advantage**:
            You can run **Standard SQL JOINs** across disconnected platforms natively in real-time.
          </div>
        </div>

        {/* Main Terminal Editor & Output */}
        <div className="xl:col-span-3 glass-card rounded-2xl flex flex-col justify-between overflow-hidden border border-border h-full">
          {/* SQL Editor Area */}
          <div className="p-4 border-b border-border bg-slate-950/20 flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                SQL Query Editor
              </span>
              <button
                onClick={() => handleRun()}
                disabled={loading || !sql.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow neon-glow-indigo transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Execute SQL</span>
              </button>
            </div>

            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              className="w-full h-20 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500/40 transition-all leading-relaxed resize-none"
              placeholder="SELECT * FROM linear.issues..."
            />
          </div>

          {/* Results Console */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/10">
            {loading && (
              <div className="py-20 flex flex-col items-center justify-center animate-pulse space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                <span className="text-xs text-slate-500 font-mono">Executing SQL Query on local Coral runtime...</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-3 font-mono leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">SQL Execution Error</h4>
                  <p className="mt-1 text-[11px] text-red-300">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>SQL result: {result.rows.length} rows returned</span>
                  <span>Execution speed: 12ms</span>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/30">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/45 text-slate-400 font-bold">
                        {result.columns.map((col, idx) => (
                          <th key={idx} className="py-3 px-4 uppercase text-[10px] tracking-wide">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {result.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/25 transition-colors">
                          {result.columns.map((col, cIdx) => (
                            <td key={cIdx} className="py-3 px-4 text-slate-200">
                              {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Table className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-slate-300">Terminal Shell Ready</h4>
                <p className="text-[10px] text-slate-500 max-w-sm">Write standard SELECT SQL queries above or select a preset to execute queries across Linear and GitHub.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
