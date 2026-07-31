import React, { useState, useEffect } from 'react';
import {
  User,
  ChevronLeft,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Lock,
  Loader,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { GlassEmptyState } from '../GlassEmptyState';
import { coursesApi, attendanceApi } from '../../api';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = 'Present' | 'Late' | 'Absent';

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  studentCode: string;
  program: string;
  status: AttendanceStatus;
}

interface FacultyAttendanceProps {
  slotId: string;
  slotName: string;
  onBackToDashboard: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FacultyAttendance: React.FC<FacultyAttendanceProps> = ({
  slotId,
  slotName,
  onBackToDashboard,
}) => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Fetch enrolled students from backend DB ──────────────────────────────
  const fetchStudents = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const students = await coursesApi.getEnrolledStudents(slotId);
      setAttendanceList(
        students.map((s) => ({
          studentId: s.studentId,
          studentName: s.studentName,
          studentCode: s.studentCode,
          program: s.program,
          status: 'Present',
        }))
      );
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load enrolled students.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotId]);

  // ── Update local attendance status ────────────────────────────────────────
  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceList((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    );
  };

  const currentUser = useAuthStore(state => state.user);
  const { faculty } = useAppStore();

  // Resolve faculty ID from DB (match by email)
  const facultyRecord = faculty.find(f => f.email === currentUser?.email);
  const facultyId = facultyRecord?.id || currentUser?.id || '';

  // ── Freeze & Save to DB ──────────────────────────────────────
  const handleSaveAndFreeze = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const entries = attendanceList.map(s => ({ studentId: s.studentId, status: s.status }));
      await attendanceApi.save(slotId, facultyId, entries);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onBackToDashboard();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save attendance:', err);
      setSaveError(err.message || 'Failed to save attendance. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalStudents = attendanceList.length;
  const presentCount = attendanceList.filter((s) => s.status === 'Present').length;
  const lateCount = attendanceList.filter((s) => s.status === 'Late').length;
  const absentCount = attendanceList.filter((s) => s.status === 'Absent').length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">

      {/* 1. Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100/50 transition-all cursor-pointer mb-3 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Timeline</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-lg font-extrabold text-indigo-950">Daily Attendance Log</h3>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              Active Lecture Block
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Currently scoring attendance matrices for <strong className="text-indigo-950">"{slotName}"</strong>.
          </p>
        </div>

        {/* Live Attendance Stats Counter */}
        <div className="flex items-center gap-2.5 bg-indigo-50/30 p-2.5 rounded-2xl border border-indigo-100/40">
          <div className="text-center px-2.5 py-1">
            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Present</p>
            <p className="text-sm font-black text-emerald-600">{presentCount}</p>
          </div>
          <div className="h-6 w-px bg-indigo-100" />
          <div className="text-center px-2.5 py-1">
            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Late</p>
            <p className="text-sm font-black text-amber-500">{lateCount}</p>
          </div>
          <div className="h-6 w-px bg-indigo-100" />
          <div className="text-center px-2.5 py-1">
            <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Absent</p>
            <p className="text-sm font-black text-red-500">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* 2. Fast-Attendance Assessment Board */}
      <div className="glass-panel rounded-3xl p-6 border border-white/50 shadow-sm">
        <div className="pb-3 border-b border-indigo-50 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div>
            <h4 className="font-display text-sm font-bold text-indigo-950">Fast-Attendance Assessment Board</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Toggle student presence status. Marks are auto-cached instantly.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Total Class Enrollment: {isLoading ? '…' : totalStudents}
            </span>
            <button
              onClick={fetchStudents}
              disabled={isLoading}
              title="Refresh student list from database"
              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 transition-all cursor-pointer active:scale-90 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Student attendance list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-indigo-600">
              <Loader className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold text-gray-500">Loading enrolled students from database…</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
              <AlertCircle className="w-8 h-8" />
              <p className="text-xs font-bold">{loadError}</p>
              <button
                onClick={fetchStudents}
                className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl border border-indigo-100 transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : attendanceList.length > 0 ? (
            attendanceList.map((student) => (
              <div
                key={student.studentId}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  student.status === 'Present'
                    ? 'bg-emerald-50/10 border-emerald-200/50'
                    : student.status === 'Late'
                    ? 'bg-amber-50/10 border-amber-200/50'
                    : 'bg-red-50/10 border-red-200/50'
                }`}
              >
                {/* Student Identity */}
                <div className="flex items-center gap-3 text-left">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      student.status === 'Present'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : student.status === 'Late'
                        ? 'bg-amber-50 border-amber-100 text-amber-500'
                        : 'bg-red-50 border-red-100 text-red-500'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-indigo-950 leading-tight">{student.studentName}</h5>
                    <p className="text-[10px] text-gray-400 font-mono font-bold mt-1">
                      {student.studentCode} • {student.program}
                    </p>
                  </div>
                </div>

                {/* 3-Way Segmented Control */}
                <div className="inline-flex rounded-2xl bg-gray-100/85 p-1 self-start sm:self-center border border-gray-200/50 shadow-inner">
                  {/* Present */}
                  <button
                    onClick={() => updateStatus(student.studentId, 'Present')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      student.status === 'Present'
                        ? 'bg-white text-emerald-600 shadow-md font-extrabold border border-emerald-100/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/30'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${student.status === 'Present' ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span>Present</span>
                  </button>

                  {/* Late */}
                  <button
                    onClick={() => updateStatus(student.studentId, 'Late')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      student.status === 'Late'
                        ? 'bg-white text-amber-600 shadow-md font-extrabold border border-amber-100/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/30'
                    }`}
                  >
                    <Clock className={`w-4 h-4 ${student.status === 'Late' ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span>Late</span>
                  </button>

                  {/* Absent */}
                  <button
                    onClick={() => updateStatus(student.studentId, 'Absent')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      student.status === 'Absent'
                        ? 'bg-white text-red-500 shadow-md font-extrabold border border-red-100/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/30'
                    }`}
                  >
                    <XCircle className={`w-4 h-4 ${student.status === 'Absent' ? 'text-red-500' : 'text-gray-400'}`} />
                    <span>Absent</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <GlassEmptyState
              title="No Enrollments Found"
              description="There are currently no students enrolled in this course. Please assign students via the Admin panel first."
            />
          )}
        </div>

        {saveError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-300 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* 3. Action Submission Bottom Area */}
        <div className="mt-8 pt-6 border-t border-indigo-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-2.5 text-xs text-indigo-900/80 leading-normal max-w-xl text-left font-medium">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Freezing the attendance log commits standard database records and activates critical alerts for any student exceeding the 20% absence threshold in compliance with the academic code.
            </span>
          </div>

          <button
            onClick={handleSaveAndFreeze}
            disabled={isSaving || saveSuccess || isLoading || attendanceList.length === 0}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-indigo-500/10"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-white" />
                <span>Synchronizing Records…</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Logs Frozen &amp; Saved!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white" />
                <span>Freeze Attendance Log</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
