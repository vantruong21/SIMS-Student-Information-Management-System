import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendanceStore, AttendanceRecord } from '../store/useAttendanceStore';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Clock, 
  MapPin, 
  User, 
  Bookmark, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Upload,
  FileText,
  X,
  Send,
  Check,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { ScheduleEvent } from '../types';
import { GlassEmptyState } from './GlassEmptyState';
import { useToast } from '../contexts/ToastContext';

interface WeeklyScheduleProps {
  schedule?: ScheduleEvent[];
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule = [] }) => {
  const { history, submitRecovery } = useAttendanceStore();
  const { enrollments, courses, students } = useAppStore();
  const user = useAuthStore(state => state.user);

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  
  const daysOfWeek: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  // Match student info from DB
  const studentInfo = students.find(s => 
    s.email?.toLowerCase() === user?.email?.toLowerCase() || 
    s.id === user?.id || 
    s.userId === user?.id
  );
  const studentKey = studentInfo?.id || user?.id;

  // Find student enrolled courses
  const myEnrollments = enrollments.filter(e => e.studentId === studentKey || e.studentId === user?.id);
  const myCourses = myEnrollments
    .map(e => courses.find(c => c.id === e.courseId || c.code === e.courseId))
    .filter(Boolean) as any[];

  // Dynamic weekly schedule allocation
  const computedSchedule: ScheduleEvent[] = schedule.length > 0 ? schedule : [];

  if (computedSchedule.length === 0 && myCourses.length > 0) {
    const dayMapping: Record<number, 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = {
      0: 'Monday',
      1: 'Tuesday',
      2: 'Wednesday',
      3: 'Thursday',
      4: 'Friday'
    };

    myCourses.forEach((c, idx) => {
      const primaryDay = dayMapping[idx % 5];
      const secondaryDay = dayMapping[(idx + 2) % 5];

      computedSchedule.push({
        id: `sched-${c.id}-1`,
        day: primaryDay,
        time: c.schedule || '09:00 - 10:30',
        courseName: c.name,
        courseCode: c.code,
        room: 'Building A • Room 302',
        instructor: c.instructor || 'Prof. Academic'
      });

      computedSchedule.push({
        id: `sched-${c.id}-2`,
        day: secondaryDay,
        time: '13:30 - 15:00',
        courseName: c.name,
        courseCode: c.code,
        room: 'Lab Center • Room 405',
        instructor: c.instructor || 'Prof. Academic'
      });
    });
  }

  // Attendance History initialization if empty
  const activeHistory: AttendanceRecord[] = history.length > 0 ? history : (
    myCourses.length > 0 ? [
      {
        id: 'rec-1',
        subject: `${myCourses[0]?.code} - ${myCourses[0]?.name}`,
        date: '2026-07-21',
        status: 'Present'
      },
      {
        id: 'rec-2',
        subject: `${myCourses[0]?.code} - ${myCourses[0]?.name}`,
        date: '2026-07-22',
        status: 'Late'
      },
      {
        id: 'rec-3',
        subject: `${myCourses[myCourses.length > 1 ? 1 : 0]?.code} - ${myCourses[myCourses.length > 1 ? 1 : 0]?.name}`,
        date: '2026-07-23',
        status: 'Absent',
        recoveryRequested: false
      }
    ] : []
  );

  const selectedRecord = activeHistory.find(h => h.id === selectedRecordId);

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Planning & Tracking
        </span>
        <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Class Schedule & Attendance</h3>
        <p className="text-xs text-gray-500 mt-1">
          Review weekly block lecture allocations and monitor past session attendance compliance.
        </p>
      </div>

      {/* Grid of Days */}
      <div>
        <h4 className="font-display text-xs font-black uppercase text-indigo-900 tracking-wider mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Weekly Lecture Block Allocations</span>
        </h4>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          {daysOfWeek.map((day) => {
            const dayEvents = computedSchedule.filter(e => e.day === day);

            return (
              <div key={day} className="glass-panel rounded-2xl p-4 flex flex-col gap-3 min-h-[220px]">
                <div className="pb-2 border-b border-indigo-100/60 flex items-center justify-between">
                  <span className="font-display font-extrabold text-xs text-indigo-950">{day}</span>
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold">
                    {dayEvents.length} {dayEvents.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="p-3 rounded-xl bg-white/70 border border-white hover:bg-white hover:shadow-sm hover:border-indigo-200 transition-all duration-300 relative group text-left"
                      >
                        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-indigo-500 rounded-r-md group-hover:scale-y-110 transition-transform" />
                        <div className="pl-2 space-y-1">
                          <p className="text-[11px] font-extrabold text-indigo-950 leading-tight line-clamp-2">
                            {event.courseName}
                          </p>
                          <p className="text-[9px] font-bold text-indigo-500 font-mono">
                            {event.courseCode}
                          </p>
                          
                          <div className="space-y-1 text-[9px] text-gray-400 pt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{event.room}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 py-6">
                      <Bookmark className="w-6 h-6 text-gray-200 mb-1" strokeWidth={1} />
                      <span className="text-[9px] font-bold text-gray-400">No scheduled blocks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Sessions Attendance Log Section */}
      <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-sm">
        <div>
          <h4 className="font-display text-sm font-bold text-indigo-950">Past Sessions Attendance Log</h4>
          <p className="text-xs text-gray-500 mt-1">Review academic presence indexes and log recovery claims for absent markings.</p>
        </div>

        {activeHistory.length > 0 ? (
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/40 bg-white/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/45 backdrop-blur-sm text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/50">
                  <th className="p-4 font-bold">Session / Module</th>
                  <th className="p-4 font-bold">Session Date</th>
                  <th className="p-4 font-bold">Attendance Badge</th>
                  <th className="p-4 font-bold text-right">In-Context Recovery Action</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-white/10">
                {activeHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-white/30 transition-colors">
                    <td className="p-4 text-left">
                      <div className="font-extrabold text-indigo-950">{record.subject}</div>
                    </td>
                    <td className="p-4 text-gray-500 font-medium font-mono">
                      {record.date}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : record.status === 'Late'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-red-50 text-red-500 border border-red-100'
                      }`}>
                        {record.status === 'Present' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {record.status === 'Late' && <Clock className="w-3 h-3 text-amber-500" />}
                        {record.status === 'Absent' && <XCircle className="w-3 h-3 text-red-500" />}
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {record.status === 'Absent' ? (
                        <>
                          {!record.recoveryRequested ? (
                            <button
                              onClick={() => setSelectedRecordId(record.id)}
                              className="bg-white/80 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 inline-flex items-center gap-1.5 ml-auto"
                            >
                              <span>Request Recovery</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold ${
                              record.recoveryStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : record.recoveryStatus === 'Approved'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-red-50 text-red-500 border border-red-100'
                            }`}>
                              <span>Recovery: {record.recoveryStatus}</span>
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <GlassEmptyState
            title="No Attendance History Logs"
            description="There are currently no past session records logged in your profile."
          />
        )}
      </div>

      {/* AttendanceRecoveryModal Popup (using Framer Motion AnimatePresence) */}
      <AnimatePresence>
        {selectedRecordId && selectedRecord && (
          <AttendanceRecoveryModal 
            record={selectedRecord}
            onClose={() => setSelectedRecordId(null)}
            onSubmit={(reason) => submitRecovery(selectedRecord.id, reason)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


/* --- AttendanceRecoveryModal Component --- */
interface AttendanceRecoveryModalProps {
  record: AttendanceRecord;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const AttendanceRecoveryModal: React.FC<AttendanceRecoveryModalProps> = ({
  record,
  onClose,
  onSubmit
}) => {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('Medical');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Check for future date vulnerability
  const isFutureDate = () => {
    try {
      const recordDate = new Date(record.date);
      // Ensure we only compare the date portion, not exact ms
      recordDate.setHours(23, 59, 59, 999);
      return recordDate.getTime() > Date.now();
    } catch (e) {
      return false;
    }
  };
  const isInvalidDate = isFutureDate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || isInvalidDate) return;

    if (!navigator.onLine) {
      toast('Cannot submit request while offline.', 'error');
      return;
    }

    setIsSubmitting(true);
    // Simulate database update
    onSubmit(reason.trim());
    toast('Recovery request submitted successfully', 'success');
    setSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with 3xl blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-indigo-950/20 backdrop-blur-3xl"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white/90 backdrop-blur-3xl border border-white p-6 shadow-2xl z-10 text-left"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Attendance Recovery Form
            </span>
            <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">
              Submit Absence Appeal
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              File academic justification dossiers to reverse session absence markers.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Course detail helper card */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 text-xs space-y-2 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Module</span>
            <span className="font-extrabold text-indigo-950">{record.subject}</span>
          </div>
          <div className="flex justify-between items-center border-t border-indigo-100/30 pt-2">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Missed Date</span>
            <span className="font-mono font-bold text-indigo-950">{record.date}</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Reason Category Selection */}
          <div>
            <label className="block text-[10px] font-black text-indigo-950 uppercase tracking-wider mb-2">
              Justification Classification
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-indigo-600/10 cursor-pointer text-indigo-950 font-semibold"
            >
              <option value="Medical">Medical Justification (Sickness / Doctor Appointment)</option>
              <option value="Family">Compassionate Leave / Family Emergency</option>
              <option value="Transport">Severe Transportation / Gridlock Delays</option>
              <option value="Institutional">Institutional Representation (Sports / Conferences)</option>
            </select>
          </div>

          {/* Written Justification */}
          <div>
            <label className="block text-[10px] font-black text-indigo-950 uppercase tracking-wider mb-2">
              Absence Justification Narrative
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State structural details and timeline parameters regarding your absence..."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all resize-none font-medium"
            />
          </div>

          {/* Simulated File Upload Drag & Drop Component */}
          <div>
            <label className="block text-[10px] font-black text-indigo-950 uppercase tracking-wider mb-2">
              Supporting Verification Dossier (PDF, JPG, PNG)
            </label>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                dragActive 
                  ? 'border-indigo-600 bg-indigo-50/40' 
                  : fileName 
                  ? 'border-emerald-300 bg-emerald-50/10' 
                  : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
              }`}
            >
              <input 
                type="file" 
                id="modal-file-upload" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label 
                htmlFor="modal-file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
              >
                {fileName ? (
                  <>
                    <FileText className="w-8 h-8 text-emerald-500 animate-bounce" />
                    <span className="text-xs font-bold text-emerald-700">{fileName}</span>
                    <span className="text-[10px] text-gray-400">Dossier attached successfully</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">Drag & drop files or click to browse</span>
                    <span className="text-[10px] text-gray-400">Supports documents up to 10 MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {isInvalidDate && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100/50">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-700">
                Security Policy: You cannot request attendance recovery for a future date. Wait until the session has occurred.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting || isInvalidDate}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Submitted Appeal!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Recovery Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
