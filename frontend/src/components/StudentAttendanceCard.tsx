import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import { GlassEmptyState } from './GlassEmptyState';

export const StudentAttendanceCard: React.FC = () => {
  const { subjects, history, submitRecovery } = useAttendanceStore();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [recoveryReason, setRecoveryReason] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedRecord = history.find(h => h.id === selectedRecordId);

  const handleSubmitRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId || !recoveryReason.trim()) return;
    submitRecovery(selectedRecordId, recoveryReason.trim());
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setSelectedRecordId(null);
      setRecoveryReason('');
    }, 2000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Subject Attendance Grid */}
      <div>
        <h4 className="font-display text-base font-bold text-indigo-950 mb-4 flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-indigo-600" />
          <span>Current Semester Subject Attendance</span>
        </h4>
        
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {subjects.map((sub) => {
              const absenceRate = (sub.absences / sub.totalSessions) * 100;
              const isWarning = absenceRate > 20;
              const radius = 32;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (absenceRate / 100) * circumference;

              return (
                <div 
                  key={sub.id} 
                  className={`glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                    isWarning 
                      ? 'border-red-200 bg-red-50/5/30 shadow-[0_8px_30px_rgb(239,68,68,0.06)]' 
                      : 'border-white/50 bg-white/60 shadow-[0_8px_30px_rgb(79,70,229,0.04)]'
                  }`}
                >
                  {/* Background warning pattern */}
                  {isWarning && (
                    <div className="absolute -top-3 -right-3 text-red-500/5 pointer-events-none select-none">
                      <ShieldAlert className="w-24 h-24" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Module Status
                      </span>
                      <h5 className="text-sm font-extrabold text-indigo-950 leading-snug line-clamp-2 min-h-[40px]">
                        {sub.name}
                      </h5>
                    </div>

                    {/* Circular progress ring */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Gray track */}
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          className="stroke-gray-100 fill-none"
                          strokeWidth="5"
                        />
                        {/* Animated progress track */}
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          className={`fill-none transition-all duration-500 ${
                            isWarning ? 'stroke-red-500' : 'stroke-indigo-600'
                          }`}
                          strokeWidth="5"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute text-xs font-black ${
                        isWarning ? 'text-red-600' : 'text-indigo-950'
                      }`}>
                        {Math.round(absenceRate)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100/60 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Absence History:</span>
                    <span className={`font-mono font-bold ${
                      isWarning ? 'text-red-600' : 'text-indigo-600'
                    }`}>
                      {sub.absences} / {sub.totalSessions} Sessions
                    </span>
                  </div>

                  {isWarning && (
                    <div className="mt-3 p-2.5 rounded-xl bg-red-50 text-red-700 text-[11px] leading-relaxed flex items-start gap-1.5 border border-red-100 animate-pulse">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Warning: Absence exceeds 20%. Eligible for immediate recovery submission.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <GlassEmptyState
            title="No Active Modules"
            description="You are currently not enrolled in any tracked course modules for this academic block."
          />
        )}
      </div>

      {/* Attendance Log Details */}
      <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="font-display text-base font-bold text-indigo-950">Recent Session Absence Log</h4>
            <p className="text-xs text-gray-500 mt-1">Review missed lectures and request academic attendance recovery</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updates hourly</span>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 border-b border-white/50">
                  <th className="p-4 font-bold">Session Subject</th>
                  <th className="p-4 font-bold">Session Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-white/20">
                {history.map((record) => (
                <tr key={record.id} className="hover:bg-white/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-indigo-950">{record.subject}</div>
                  </td>
                  <td className="p-4 text-gray-500 font-medium font-mono">
                    {record.date}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      record.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : record.status === 'Late'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {record.status === 'Present' && <CheckCircle2 className="w-3 h-3" />}
                      {record.status === 'Late' && <Clock className="w-3 h-3" />}
                      {record.status === 'Absent' && <XCircle className="w-3 h-3" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-gray-400 text-xs">-</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <GlassEmptyState
          title="No Recent Absences"
          description="Your academic attendance ledger has zero recent absences recorded."
        />
      )}
    </div>

      {/* Framer Motion animated Modal */}
      <AnimatePresence>
        {selectedRecordId && selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecordId(null)}
              className="absolute inset-0 bg-indigo-950/20 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white/90 backdrop-blur-3xl border border-white p-6 shadow-2xl z-10"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Attendance Recovery Request
                  </span>
                  <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">
                    Submit Session Justification
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide credentials or justification to reverse absence status.
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedRecordId(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Course information detail card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 text-left mb-5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Subject:</span>
                  <span className="font-bold text-indigo-950">{selectedRecord.subject}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Missed Date:</span>
                  <span className="font-mono font-bold text-indigo-950">{selectedRecord.date}</span>
                </div>
              </div>

              <form onSubmit={handleSubmitRecovery} className="space-y-4 text-left">
                <div>
                  <label htmlFor="reason" className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
                    Justification / Reason for Absence
                  </label>
                  <textarea
                    id="reason"
                    required
                    value={recoveryReason}
                    onChange={(e) => setRecoveryReason(e.target.value)}
                    rows={4}
                    placeholder="Provide description of your absence (e.g. Medical doctor appointment, commute delays...)"
                    className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordId(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={successMsg}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {successMsg ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Submitted!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Recovery Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
