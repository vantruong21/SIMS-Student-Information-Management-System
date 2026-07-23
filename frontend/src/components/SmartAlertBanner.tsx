import React from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface SmartAlertBannerProps {
  onNavigateToModules: () => void;
}

export const SmartAlertBanner: React.FC<SmartAlertBannerProps> = ({ onNavigateToModules }) => {
  const { subjects } = useAttendanceStore();

  // Find any subject with absence rate >= 20%
  const atRiskSubjects = subjects.filter(
    (sub) => (sub.absences / sub.totalSessions) * 100 >= 20
  );

  if (atRiskSubjects.length === 0) return null;

  return (
    <div 
      onClick={onNavigateToModules}
      className="relative overflow-hidden rounded-2xl border border-red-200/80 bg-red-50/15/20 hover:bg-red-50/15/30 transition-all duration-300 shadow-[0_4px_24px_rgba(239,68,68,0.06)] backdrop-blur-xl p-4 flex items-center justify-between gap-4 cursor-pointer group text-left animate-in slide-in-from-top-4 duration-500"
    >
      {/* Absolute background soft glow */}
      <div className="absolute top-0 left-0 w-32 h-full bg-red-500/5 blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0 border border-red-100 animate-pulse">
          <AlertTriangle className="w-4.5 h-4.5" />
        </div>
        <div className="text-left">
          <h5 className="text-xs font-black text-red-700 uppercase tracking-wider">
            Critical Absence Warning
          </h5>
          <p className="text-xs text-gray-600 font-medium mt-0.5 leading-normal">
            Your absence rate in <strong className="text-indigo-950 font-bold">"{atRiskSubjects[0].name}"</strong> is currently {Math.round((atRiskSubjects[0].absences / atRiskSubjects[0].totalSessions) * 100)}%. Immediate action is required to avoid academic hold.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold shrink-0 relative z-10">
        <span>Resolve Now</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};
