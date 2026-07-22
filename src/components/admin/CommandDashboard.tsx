import React from 'react';
import { 
  Users, 
  BookOpen, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  ArrowUpRight, 
  Cpu, 
  Layers, 
  Clock,
  TrendingUp,
  Server
} from 'lucide-react';
import { Student, Course } from '../../types';

interface CommandDashboardProps {
  studentsCount: number;
  coursesCount: number;
  recentLogs: string[];
}

export const CommandDashboard: React.FC<CommandDashboardProps> = ({
  studentsCount,
  coursesCount,
  recentLogs
}) => {
  // Stat Card Config
  const stats = [
    {
      label: 'System Node Cluster',
      value: 'Awaiting DB',
      sub: 'Ready for Database Sync',
      icon: Server,
      color: 'indigo',
      badge: 'Local Mode',
      badgeColor: 'emerald'
    },
    {
      label: 'Synchronized Users',
      value: studentsCount.toLocaleString(),
      sub: `${studentsCount} active student profiles`,
      icon: Users,
      color: 'blue',
      badge: 'Live',
      badgeColor: 'emerald'
    },
    {
      label: 'Active Classes',
      value: coursesCount.toString(),
      sub: 'Courses initialized',
      icon: BookOpen,
      color: 'purple',
      badge: 'Live',
      badgeColor: 'indigo'
    },
    {
      label: 'API Request Latency',
      value: '—',
      sub: 'Awaiting API Connection',
      icon: Cpu,
      color: 'cyan',
      badge: 'Standby',
      badgeColor: 'emerald'
    }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* SECTION 1: GLOWING STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between group hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative radial glow orb effect */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all duration-300" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{stat.label}</span>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-indigo-950 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-white shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-1.5 mt-4 relative z-10 text-[10px]">
                <span className="text-gray-400 font-bold">{stat.sub}</span>
                <span className="font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-100/30">
                  {stat.badge}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* SECTION 2: SYSTEM HEALTH MONITOR & SYSTEM LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Recent Admin Actions System Logs Card (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/50 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-indigo-150/40 mb-4 shrink-0">
            <div className="text-left">
              <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                <Terminal className="w-4.5 h-4.5 text-indigo-600" />
                <span>System Incident Logs</span>
              </h4>
              <p className="text-[10px] text-gray-400 font-medium">Real-time audit trailing of administrative workflows</p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LOGS STREAMING</span>
            </div>
          </div>

          {/* Interactive Logs Monitor Content */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
            {recentLogs.map((log, index) => {
              const parts = log.split(' - ');
              const time = parts[0] || '';
              const desc = parts[1] || '';

              return (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white/40 hover:bg-white/60 rounded-2xl border border-indigo-100/30 transition-all text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100/30 mr-2">
                      {time}
                    </span>
                    <p className="text-indigo-950 font-semibold mt-1 leading-normal">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Cluster SLA Status Metrics (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/50 flex flex-col justify-between">
          <div className="pb-4 border-b border-indigo-150/40 mb-4 text-left">
            <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-indigo-600" />
              <span>Cluster Diagnostics</span>
            </h4>
            <p className="text-[10px] text-gray-400 font-medium">Current node network telemetry and metrics</p>
          </div>

          <div className="space-y-4 text-left">
            {/* Telemetry rows */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-700">Database Connection</span>
                <span className="text-gray-500">Not Connected</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-300 w-[0%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-700">API Gateway Status</span>
                <span className="text-gray-500">Standby</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-300 w-[0%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-700">Local Cache Storage</span>
                <span className="text-gray-500">Active</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[100%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
              System is operating in Local Storage mode. Ready to be integrated with ASP.NET Core backend.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
