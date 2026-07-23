import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendanceStore, RecoveryRequest } from '../store/useAttendanceStore';
import { 
  Check, 
  X, 
  Bell, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Inbox,
  Sparkles,
  Loader
} from 'lucide-react';
import { GlassEmptyState } from './GlassEmptyState';

interface FacultyRecoveryInboxProps {
  onShowNotificationBanner?: (message: string) => void;
}

export const FacultyRecoveryInbox: React.FC<FacultyRecoveryInboxProps> = ({
  onShowNotificationBanner
}) => {
  const { 
    requests, 
    approveRequest, 
    rejectRequest, 
    facultyClassAttendance, 
    updateFacultyClassAttendance 
  } = useAttendanceStore();

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const handleApprove = (req: RecoveryRequest) => {
    setProcessingId(req.id);
    setTimeout(() => {
      approveRequest(req.id);
      if (onShowNotificationBanner) {
        onShowNotificationBanner(`Approved recovery request for ${req.studentName} in ${req.subject}`);
      }
      setProcessingId(null);
    }, 600);
  };

  const handleReject = (req: RecoveryRequest) => {
    rejectRequest(req.id);
    if (onShowNotificationBanner) {
      onShowNotificationBanner(`Rejected recovery request for ${req.studentName}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* 1. Fast-Action Attendance Board (Left 2 Columns on Desktop) */}
      <div className="lg:col-span-2 space-y-5">
        <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Fast-Entry Assessment
              </span>
              <h4 className="font-display text-lg font-bold text-indigo-950 mt-2">
                Fast-Action Attendance Board
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Instantly capture and log attendance for today's active block session
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Session: Today, Active</span>
            </div>
          </div>

          {/* Student attendance list with segmented buttons */}
          <div className="space-y-3.5">
            {facultyClassAttendance.length > 0 ? (
              facultyClassAttendance.map((student) => (
                <div 
                  key={student.studentId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-indigo-950">{student.studentName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {student.studentId}</p>
                    </div>
                  </div>

                  {/* Segmented control buttons */}
                  <div className="inline-flex rounded-xl bg-gray-100 p-1 self-start sm:self-center border border-gray-200">
                    <button
                      onClick={() => updateFacultyClassAttendance(student.studentId, 'Present')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                        student.status === 'Present'
                          ? 'bg-white text-emerald-600 shadow-sm font-extrabold'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => updateFacultyClassAttendance(student.studentId, 'Late')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                        student.status === 'Late'
                          ? 'bg-white text-amber-600 shadow-sm font-extrabold'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => updateFacultyClassAttendance(student.studentId, 'Absent')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                        student.status === 'Absent'
                          ? 'bg-white text-red-500 shadow-sm font-extrabold'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <GlassEmptyState
                title="No Cohort Registered"
                description="There are currently no active student cohorts registered under this block lecture slot."
              />
            )}
          </div>

          {/* Quick submission notification */}
          <div className="mt-5 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-indigo-900/85">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>Marks are auto-synced with the Student Academic Information Portal.</span>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
              Freeze Attendance Log
            </button>
          </div>
        </div>
      </div>

      {/* 2. Recovery Requests Inbox (Right Column on Desktop) */}
      <div className="space-y-5">
        <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-indigo-950" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <h4 className="font-display text-base font-bold text-indigo-950">
                Pending Recovery Requests
              </h4>
            </div>
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {pendingRequests.length} Pending
            </span>
          </div>

          {/* Requests list wrapper */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] pr-1">
            <AnimatePresence mode="popLayout">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 rounded-2xl bg-white/70 border border-white hover:bg-white transition-all shadow-[0_4px_20px_rgba(79,70,229,0.02)] flex flex-col gap-3 text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {req.subject}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {req.date}
                        </span>
                      </div>
                      <h5 className="text-xs font-black text-indigo-950 mt-2">
                        {req.studentName}
                      </h5>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                        {req.studentEmail}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 text-[11px] text-gray-600 border border-gray-100/50 leading-relaxed italic">
                      " {req.reason} "
                    </div>

                    {/* Action buttons with crystal styles */}
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleReject(req)}
                        disabled={processingId === req.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all border border-red-100/40 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(req)}
                        disabled={processingId === req.id}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 cursor-pointer disabled:cursor-not-allowed ${
                          processingId === req.id 
                            ? 'bg-emerald-500 text-white border-emerald-600' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100/40'
                        }`}
                      >
                        {processingId === req.id ? (
                          <>
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
                  <Inbox className="w-10 h-10 text-gray-300 stroke-1" />
                  <div>
                    <p className="text-xs font-bold text-gray-500">Inbox Clean</p>
                    <p className="text-[10px] text-gray-400">All student absence recovery requests have been reviewed</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
};
