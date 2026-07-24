import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Check } from 'lucide-react';
import { Student, Course } from '../types';
import { useAppStore } from '../store/useAppStore';
import { CommandDashboard } from './admin/CommandDashboard';
import { UsersDataTable } from './admin/UsersDataTable';
import { DualPanelAllocation } from './admin/DualPanelAllocation';
import { AdminCourseManagement } from './admin/AdminCourseManagement';
import { DepartmentManagement } from './admin/DepartmentManagement';
import { FacultyManagement } from './admin/FacultyManagement';
import { SystemSettings } from './admin/SystemSettings';


interface AdminDashboardProps {
  searchQuery: string;
  setSearchQuery?: (query: string) => void;
  currentTab?: string;
  courses?: Course[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  searchQuery, 
  setSearchQuery = () => {},
  currentTab = 'dashboard',
  courses = []
}) => {
  // Persistence state in memory for registered/imported students
  
  // Recent admin action logs
  const [recentLogs, setRecentLogs] = useState<string[]>([]);

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    // Append to system logs
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setRecentLogs(prev => [`${timeString} - ${message}`, ...prev]);
  }, []);

  // Clear toast timeout safely
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle student approval
  const updateStudentStatus = useAppStore(state => state.updateStudentStatus);
  const handleApproveStudent = useCallback((studentId: string) => {
    updateStudentStatus(studentId, 'Active');
    showToast(`Successfully approved academic credentials for: ${studentId}`, 'success');
  }, [showToast, updateStudentStatus]);
  /*
    if (localStudents.some(s => s.id === studentId)) {
      setLocalStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'Active' as const } : s));
    } else {
      // In case student is from initial query dataset, add a dummy entry to localStudents override list
      // Or simply show success and keep state
    }
    showToast(`Successfully approved academic credentials for: ${studentId}`, 'success');
  }, [localStudents, showToast]);

*/
  // Handle student delete
  const deleteStudent = useAppStore(state => state.deleteStudent);
  const handleDeleteStudent = useCallback((studentId: string) => {
    deleteStudent(studentId);
    showToast(`Successfully deleted student profile: ${studentId}`, 'success');
  }, [showToast, deleteStudent]);
  /*
    setLocalStudents(prev => prev.filter(s => s.id !== studentId));
    showToast(`Successfully deleted student profile: ${studentId}`, 'success');
  }, [showToast]);

*/
  const addStudent = useAppStore(state => state.addStudent);
  const handleAddLocalStudent = useCallback(async (student: Student) => {
    return await addStudent(student);
  }, [addStudent]);

  const toggleUserLock = useAppStore(state => state.toggleUserLock);
  const handleToggleLock = useCallback((email: string) => {
    toggleUserLock(email);
    showToast(`Successfully toggled lock status for user: ${email}`, 'success');
  }, [showToast, toggleUserLock]);

  const updateStudentProfile = useAppStore(state => state.updateStudentProfile);
  const handleEditLocalStudent = useCallback((studentId: string, data: any) => {
    updateStudentProfile(studentId, data);
  }, [updateStudentProfile]);
  /*
    setLocalStudents(prev => [student, ...prev]);
  }, []);

*/
  const handleImportLocalStudents = useCallback((newStudents: Student[]) => {
    newStudents.forEach(s => addStudent(s));
  }, [addStudent]);
  /*
    setLocalStudents(prev => [...students, ...prev]);
  }, []);

  // Combine query and local data counts for the Dashboard view
*/
  const students = useAppStore(state => state.students);
  const combinedStudentsCount = students.length;

  const defaultCoursesCount = useMemo(() => {
    return courses.length;
  }, [courses]);

  // Render sub-tab content based on App layout's current tab state
  const renderSubTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <CommandDashboard 
            studentsCount={combinedStudentsCount}
            coursesCount={defaultCoursesCount}
            recentLogs={recentLogs}
          />
        );
      case 'students':
        return (
          <UsersDataTable 
            searchQuery={searchQuery}
            students={students}
            onAddLocalStudent={handleAddLocalStudent}
            onImportLocalStudents={handleImportLocalStudents}
            onApproveStudent={handleApproveStudent}
            onDeleteStudent={handleDeleteStudent}
            onToggleLock={handleToggleLock}
            onShowToast={showToast}
            onEditLocalStudent={handleEditLocalStudent}
          />
        );
      case 'allocation':
        return (
          <DualPanelAllocation 
            students={students}
            courses={courses}
            onShowToast={showToast}
          />
        );
      case 'courses':
        return (
          <AdminCourseManagement courses={courses} />
        );
      case 'departments':
        return (
          <DepartmentManagement />
        );
      case 'faculty':
        return (
          <FacultyManagement 
            searchQuery={searchQuery}
            onShowToast={showToast}
          />
        );
      case 'settings':
        return (
          <SystemSettings onShowToast={showToast} />
        );
      case 'profile':
        return null;

      default:
        return (
          <CommandDashboard 
            studentsCount={combinedStudentsCount}
            coursesCount={defaultCoursesCount}
            recentLogs={recentLogs}
          />
        );
    }
  };


  return (
    <div className="space-y-6">
      {/* Subtab content container */}
      <div className="animate-in fade-in duration-300">
        {renderSubTab()}
      </div>

      {/* Floating Glassmorphic Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm glass-panel bg-white/95 border-emerald-100 shadow-xl rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <Check className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-indigo-950">{toast.type === 'success' ? 'Operation Success' : 'Notification'}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold ml-auto focus:outline-none cursor-pointer"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to provide seed unassigned students for the Dual-Panel matrix
function getSeededStudents(): Student[] {
  return [];
}
