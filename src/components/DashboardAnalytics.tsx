import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  LineChart, 
  Line
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, LineChart as LineIcon, GraduationCap } from 'lucide-react';
import { UserProfile } from '../types';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { GlassEmptyState } from './GlassEmptyState';

interface DashboardAnalyticsProps {
  user: UserProfile;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ user }) => {
  const isStudent = user.role === 'Student';
  const { subjects, requests } = useAttendanceStore();
  const hasNoData = isStudent ? subjects.length === 0 : requests.length === 0;

  // Mock data for Admin analytics
  const adminProgramData = [
    { name: 'Software Engineering', students: 4850, fill: '#4f46e5' },
    { name: 'Marketing', students: 3120, fill: '#06b6d4' },
    { name: 'Graphic Design', students: 1650, fill: '#8b5cf6' }
  ];

  const adminGPAData = [
    { range: '3.6 - 4.0', count: 4250 },
    { range: '3.2 - 3.5', count: 5120 },
    { range: '2.8 - 3.1', count: 2150 },
    { range: '2.4 - 2.7', count: 680 },
    { range: '< 2.4', count: 250 },
  ];

  const adminSystemActivity = [
    { day: 'Mon', requests: 45000, uptime: 99.92 },
    { day: 'Tue', requests: 52000, uptime: 99.95 },
    { day: 'Wed', requests: 49000, uptime: 99.94 },
    { day: 'Thu', requests: 61000, uptime: 99.90 },
    { day: 'Fri', requests: 55000, uptime: 99.98 },
    { day: 'Sat', requests: 22000, uptime: 100.0 },
    { day: 'Sun', requests: 18000, uptime: 100.0 },
  ];

  // Mock data for Student analytics
  const studentGPAHistory = [
    { semester: 'Term 1 (Freshman)', GPA: 3.75 },
    { semester: 'Term 2 (Freshman)', GPA: 3.82 },
    { semester: 'Term 3 (Sophomore)', GPA: 3.85 },
    { semester: 'Term 4 (Sophomore)', GPA: 3.80 },
    { semester: 'Term 5 (Junior)', GPA: 3.92 },
  ];

  const studentTimeDistribution = [
    { name: 'Attending Lectures', value: 40, color: '#4f46e5' },
    { name: 'Independent Study & Labs', value: 35, color: '#06b6d4' },
    { name: 'Group Discussions', value: 15, color: '#f59e0b' },
    { name: 'Extracurricular Activities', value: 10, color: '#e11d48' },
  ];

  if (hasNoData) {
    return (
      <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
        <div>
          <h3 className="font-display text-lg font-bold text-indigo-950">Academic Insights & Analytics</h3>
          <p className="text-xs text-gray-500 mt-1">Visual representations of student progress, server loads, and program demographics.</p>
        </div>
        <GlassEmptyState
          title="No Analytics Data Available"
          description="The system has no active student records, registered enrollments, or academic logs to calculate performance charts."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div>
        <h3 className="font-display text-lg font-bold text-indigo-950">Academic Insights & Analytics</h3>
        <p className="text-xs text-gray-500 mt-1">Visual representations of student progress, server loads, and program demographics.</p>
      </div>

      {isStudent ? (
        // STUDENT ANALYTICS LAYOUT
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GPA Progress chart */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-white/50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h4 className="font-display text-sm font-bold text-indigo-950">Cumulative GPA Milestones</h4>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentGPAHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="semester" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[3.0, 4.0]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="GPA" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#gpaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">Accumulative GPA timeline metrics across the last 5 terms</p>
          </div>

          {/* Time Distribution Chart */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-white/50">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-5 h-5 text-indigo-600" />
              <h4 className="font-display text-sm font-bold text-indigo-950">Weekly Scholar Allocation of Time (%)</h4>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-64 mt-4">
              <div className="w-full sm:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentTimeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {studentTimeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 space-y-2">
                {studentTimeDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium">{item.name}:</span>
                    <span className="font-bold text-indigo-950">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ADMINISTRATOR ANALYTICS LAYOUT
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Student Count by Program chart */}
            <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-white/50">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h4 className="font-display text-sm font-bold text-indigo-950">Student Population by Program Major</h4>
              </div>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminProgramData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                      {adminProgramData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GPA Distribution chart */}
            <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-white/50">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h4 className="font-display text-sm font-bold text-indigo-950">University-Wide GPA Distribution Spectrum</h4>
              </div>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminGPAData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#316bf3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* System Load Activity line chart */}
          <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-sm border border-white/50">
            <div className="flex items-center gap-2 mb-4">
              <LineIcon className="w-5 h-5 text-indigo-600" />
              <h4 className="font-display text-sm font-bold text-indigo-950">System Infrastructure Load & Portal API Requests</h4>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adminSystemActivity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="requests" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">Core server clusters sustained &gt;99.98% uptime SLA metrics over the trailing 7 days</p>
          </div>
        </div>
      )}
    </div>
  );
};
