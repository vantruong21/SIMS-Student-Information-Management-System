import React from 'react';
import { motion } from 'motion/react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { X, Check, AlertCircle, Calendar, Mail, User, Inbox, AlertTriangle } from 'lucide-react';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActionDrawer: React.FC<ActionDrawerProps> = ({ isOpen, onClose }) => {
  const { requests, approveRequest, rejectRequest } = useAttendanceStore();
  
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  return (
    <div className="relative">
      {/* Backdrop overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-indigo-950/20 backdrop-blur-md z-40 transition-opacity"
        />
      )}

      {/* Sliding Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 h-screen w-full sm:w-[460px] bg-white/70 backdrop-blur-2xl border-l border-white/60 shadow-[-12px_0_40px_rgba(79,70,229,0.08)] p-6 z-50 flex flex-col"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100/50 mb-6">
          <div className="text-left">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Inbox Notifications
            </span>
            <h3 className="font-display text-lg font-extrabold text-indigo-950 mt-1.5">Action Center</h3>
            <p className="text-[11px] text-gray-500">Respond to student academic recovery requests.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-indigo-950 flex items-center justify-center transition-colors cursor-pointer border border-gray-100/85"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pending Requests List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl bg-white/65 border border-white hover:bg-white/95 transition-all duration-300 shadow-[0_4px_20px_rgba(79,70,229,0.02)] flex flex-col gap-4 text-left relative overflow-hidden"
              >
                {/* Visual Glass Glow Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/80 to-purple-500/80" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider truncate max-w-[200px]">
                      {req.subject}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {req.date}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center border border-indigo-100">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black text-indigo-950 leading-tight">
                        {req.studentName}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3 shrink-0" />
                        {req.studentEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Justification Box */}
                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100/50 text-[11px] text-gray-600 leading-relaxed relative">
                  <div className="absolute top-1 left-2 text-indigo-300 font-serif text-lg leading-none">“</div>
                  <p className="pl-3 pr-2 italic">
                    {req.reason}
                  </p>
                </div>

                {/* Inline Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => rejectRequest(req.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100/70 text-red-600 text-xs font-extrabold transition-all border border-red-100/50 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => approveRequest(req.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-emerald-600 text-xs font-extrabold transition-all border border-emerald-100/50 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                <Inbox className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-indigo-950">Inbox is Clean</p>
                <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed mx-auto">
                  No pending student absence recovery requests require evaluation at this moment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Support Notice */}
        <div className="mt-4 pt-4 border-t border-indigo-50 flex items-center gap-2 text-[10px] text-indigo-600/75 leading-relaxed font-semibold bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/20 text-left">
          <AlertTriangle className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Decisions made in the Action Center instantly override student attendance status logs and recalculate absence thresholds.</span>
        </div>
      </motion.div>
    </div>
  );
};
