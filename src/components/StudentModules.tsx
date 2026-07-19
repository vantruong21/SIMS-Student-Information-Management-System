import React from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { 
  Layers, 
  BookOpen, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { GlassEmptyState } from './GlassEmptyState';

export const StudentModules: React.FC = () => {
  const { subjects } = useAttendanceStore();

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Semester Tracking
        </span>
        <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Current Semester Modules</h3>
        <p className="text-xs text-gray-500 mt-1">Detailed evaluation metrics, credit allocation, and session absence tracking.</p>
      </div>

      {/* Grid of Subjects */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const absenceRate = (sub.absences / sub.totalSessions) * 100;
            const isWarning = absenceRate >= 20;
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (absenceRate / 100) * circumference;

            return (
              <div 
                key={sub.id} 
                className={`glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between min-h-[280px] ${
                  isWarning 
                    ? 'border-red-300 bg-gradient-to-b from-red-50/10 to-red-100/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.25)] shadow-red-200/50' 
                    : 'border-white/60 bg-white/60 shadow-[0_12px_40px_rgba(79,70,229,0.03)]'
                }`}
              >
                {/* Background Glow Ring */}
                {isWarning && (
                  <div className="absolute inset-0 bg-red-500/5 pointer-events-none select-none animate-pulse" />
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-white/80 border border-white shadow-sm">
                      <BookOpen className={`w-5 h-5 ${isWarning ? 'text-red-600' : 'text-indigo-600'}`} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      isWarning ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isWarning ? 'At Risk' : 'In Compliance'}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-extrabold text-indigo-950 leading-snug tracking-tight mb-2">
                    {sub.name}
                  </h4>

                  <div className="flex gap-4 items-center mt-5">
                    {/* Big Circular Progress Ring */}
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Gray track */}
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          className="stroke-gray-100/80 fill-none"
                          strokeWidth="7"
                        />
                        {/* Dynamic track */}
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          className={`fill-none transition-all duration-700 ${
                            isWarning ? 'stroke-red-500' : 'stroke-indigo-600'
                          }`}
                          strokeWidth="7"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className={`text-base font-black ${
                          isWarning ? 'text-red-600' : 'text-indigo-950'
                        }`}>
                          {Math.round(absenceRate)}%
                        </span>
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">
                          Absent
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Session Logs</p>
                      <p className="font-extrabold text-indigo-950">
                        {sub.absences} Missed Blocks
                      </p>
                      <p className="text-gray-500">
                        Out of {sub.totalSessions} Total Sessions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer status / warning alerts */}
                <div className="mt-6 pt-4 border-t border-gray-100/60 flex items-center justify-between text-xs">
                  {isWarning ? (
                    <div className="flex items-start gap-1.5 text-red-700 font-semibold leading-snug">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <span>Absence exceeds 20%. Please submit a Recovery Request.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Safe attendance threshold</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <GlassEmptyState
          title="No Registered Modules"
          description="There are currently no active academic modules or course structures allocated to your profile for the current term."
        />
      )}

      {/* Coursework & Grading Policy Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/50 text-left">
          <div className="flex gap-2 items-center text-sm font-bold text-indigo-950 mb-2">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Attendance Requirements & Rules</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Students are expected to maintain at least <strong>80% attendance</strong> across all modules in order to qualify for the final examinations. Missing more than 20% of sessions in any single subject without a submitted and approved Recovery Request will trigger an automatic academic hold for that subject.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/50 text-left">
          <div className="flex gap-2 items-center text-sm font-bold text-indigo-950 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Recovery Approval Criteria</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Approved justifications include documented illness (medical certs), official family emergency, or university-related team travel. Direct photo/document uploads must be submitted within <strong>5 business days</strong> of the missed session block.
          </p>
        </div>
      </div>
    </div>
  );
};
