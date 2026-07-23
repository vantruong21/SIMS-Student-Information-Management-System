import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface SubjectAttendance {
  id: string;
  name: string;
  totalSessions: number;
  absences: number;
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  date: string;
  status: 'Present' | 'Late' | 'Absent';
  recoveryRequested?: boolean;
  recoveryReason?: string;
  recoveryStatus?: 'Pending' | 'Approved' | 'Rejected' | null;
}

export interface RecoveryRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  recordId: string;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface StudentAttendanceStatus {
  studentId: string;
  studentName: string;
  status: 'Present' | 'Late' | 'Absent';
}

interface AttendanceState {
  subjects: SubjectAttendance[];
  history: AttendanceRecord[];
  requests: RecoveryRequest[];
  facultyClassAttendance: StudentAttendanceStatus[];
  submitRecovery: (recordId: string, reason: string) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  updateFacultyClassAttendance: (studentId: string, status: 'Present' | 'Late' | 'Absent') => void;
}

const INITIAL_SUBJECTS: SubjectAttendance[] = [];

const INITIAL_HISTORY: AttendanceRecord[] = [];

const INITIAL_REQUESTS: RecoveryRequest[] = [];

const INITIAL_FACULTY_ATTENDANCE: StudentAttendanceStatus[] = [];

export const useAttendanceStore = create<AttendanceState>((set) => ({
  subjects: INITIAL_SUBJECTS,
  history: INITIAL_HISTORY,
  requests: INITIAL_REQUESTS,
  facultyClassAttendance: INITIAL_FACULTY_ATTENDANCE,

  submitRecovery: (recordId, reason) => {
    set((state) => {
      // SECURITY: XSS Sanitization. Strip any HTML tags from reason.
      const sanitizedReason = reason.replace(/<[^>]*>?/gm, '').trim();

      // Find the record in history
      const record = state.history.find((r) => r.id === recordId);
      if (!record) return state;

      const newRequestId = `req-${Date.now()}`;
      const newRequest: RecoveryRequest = {
        id: newRequestId,
        studentName: useAuthStore.getState().user?.name || 'Unknown Student',
        studentEmail: useAuthStore.getState().user?.email || 'unknown@elevate.edu',
        subject: record.subject,
        recordId: record.id,
        reason: reason,
        date: record.date,
        status: 'Pending',
      };

      const updatedHistory = state.history.map((r) =>
        r.id === recordId
          ? { ...r, recoveryRequested: true, recoveryReason: reason, recoveryStatus: 'Pending' as const }
          : r
      );

      return {
        history: updatedHistory,
        requests: [newRequest, ...state.requests],
      };
    });
  },

  approveRequest: (requestId) => {
    set((state) => {
      const request = state.requests.find((r) => r.id === requestId);
      if (!request) return state;

      // Update request status
      const updatedRequests = state.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'Approved' as const } : r
      );

      // Update attendance history for student
      const updatedHistory = state.history.map((r) => {
        if (r.id === request.recordId) {
          return { ...r, status: 'Present' as const, recoveryStatus: 'Approved' as const };
        }
        return r;
      });

      // Recalculate absence count for the subject if it exists
      const updatedSubjects = state.subjects.map((sub) => {
        if (sub.name === request.subject) {
          // If the student's status changes from Absent to Present, reduce absences by 1
          return { ...sub, absences: Math.max(0, sub.absences - 1) };
        }
        return sub;
      });

      return {
        requests: updatedRequests,
        history: updatedHistory,
        subjects: updatedSubjects,
      };
    });
  },

  rejectRequest: (requestId) => {
    set((state) => {
      const request = state.requests.find((r) => r.id === requestId);
      if (!request) return state;

      // Update request status
      const updatedRequests = state.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'Rejected' as const } : r
      );

      // Update attendance history for student
      const updatedHistory = state.history.map((r) => {
        if (r.id === request.recordId) {
          return { ...r, recoveryStatus: 'Rejected' as const };
        }
        return r;
      });

      return {
        requests: updatedRequests,
        history: updatedHistory,
      };
    });
  },

  updateFacultyClassAttendance: (studentId, status) => {
    set((state) => {
      const updatedList = state.facultyClassAttendance.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      );
      return { facultyClassAttendance: updatedList };
    });
  },
}));
