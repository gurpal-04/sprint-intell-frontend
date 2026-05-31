import React, { useEffect } from 'react';
import { useSprint } from '../context/SprintContext';
import { Users, ShieldAlert, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function TeamWorkloadView() {
  const { sprintData, loading, fetchTeamData } = useSprint();

  useEffect(() => {
    fetchTeamData();
  }, []);

  if (loading || !sprintData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded"></div>
        <div className="h-64 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  const { team } = sprintData;

  // Prepare workload charts dataset
  const chartData = team.map(eng => ({
    name: eng.name.split(' ')[0], // first name for compact axis
    Workload: eng.workloadScore,
    Reviews: eng.pendingReviews,
    Tasks: eng.activeTasks
  }));

  const getWorkloadProgressColor = (score) => {
    if (score >= 85) return 'bg-red-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getWorkloadTextStatus = (score, status) => {
    if (score >= 85) return 'Critical Load';
    if (score >= 70) return 'High Load';
    if (status === "Out Sick") return 'Out Sick';
    return 'Healthy Capacity';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Team Workload</h1>
        <p className="text-slate-400 text-xs mt-0.5">Audit human capacity limits, open pull reviews, and balance sprint point distribution.</p>
      </div>

      {/* Main Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-200">Workload Capacity Distribution</h3>
            <p className="text-[11px] text-slate-400">Comparing active tasks, review backlogs, and cumulative capacity scores.</p>
          </div>
          <div className="h-64 w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161e30" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1420', border: '1px solid #1f293d', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="Workload" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Load Summary Statistics */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-200">Sprint Delivery Risk</h3>
            <p className="text-[11px] text-slate-400">Human factor anomalies matching current workload.</p>
          </div>

          <div className="space-y-3.5 flex-1 mt-4">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" /> Total Engineers
              </span>
              <span className="font-bold text-slate-200">{team.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" /> Overloaded Engineers
              </span>
              <span className="font-bold text-red-400">{team.filter(e => e.workloadScore >= 85).length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Combined Pending Reviews
              </span>
              <span className="font-bold text-indigo-300">
                {team.reduce((acc, e) => acc + e.pendingReviews, 1)} open
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((eng) => {
          const isOverloaded = eng.workloadScore >= 85;
          return (
            <div 
              key={eng.id} 
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between transition-all ${
                isOverloaded ? 'border-red-500/20 bg-red-500/5' : ''
              }`}
            >
              {/* Profile Block */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={eng.avatar} alt={eng.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-800 shadow-sm" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 leading-none truncate">{eng.name}</h3>
                      <span className="text-[11px] text-slate-400 inline-block mt-1 font-mono">{eng.handle}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    isOverloaded 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : eng.status === "Out Sick" 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 animate-pulse'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {eng.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 italic mt-3.5 leading-relaxed truncate-3-lines">{eng.bio}</p>

                {/* Substats */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-900">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <div>
                      <span className="text-[9px] text-slate-500 font-semibold block uppercase">Active Tasks</span>
                      <span className="text-xs font-bold text-slate-200">{eng.activeTasks}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <span className="text-[9px] text-slate-500 font-semibold block uppercase">Pending Reviews</span>
                      <span className="text-xs font-bold text-slate-200">{eng.pendingReviews} reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workload Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">{getWorkloadTextStatus(eng.workloadScore, eng.status)}</span>
                  <span className="font-bold text-slate-200">{eng.workloadScore}% Capacity</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getWorkloadProgressColor(eng.workloadScore)}`} 
                    style={{ width: `${eng.workloadScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
