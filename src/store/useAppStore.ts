import { create } from 'zustand';
import { AppFacade } from '../facades/AppFacade';
import { useAuthStore } from './useAuthStore';

// --- RBAC Middleware Shield ---
const requireRoles = (allowedRoles: string[]) => {
  const role = useAuthStore.getState().user?.role;
  if (!role || !allowedRoles.includes(role)) {
    console.error(`[RBAC BLOCK] Unauthorized access attempt. Required: ${allowedRoles.join('/')}, Got: ${role || 'Anonymous'}`);
    return false;
  }
  return true;
};

/**
 * useAppStore — Application State Management
 * 
 * Wired to AppFacade for CSV-persistent data operations.
 * All mutations go through AppFacade → Repositories → localStorage CSV.
 * 
 * DESIGN PATTERN: Facade Pattern — simplified API via AppFacade
 * SOLID — Dependency Inversion: Store depends on AppFacade abstraction
 */

interface AppState {
  // State (loaded from CSV repositories via facade)
  students: any[];
  courses: any[];
  enrollments: any[];
  grades: any[];
  departments: any[];
  faculty: any[];
  isInitialized: boolean;
  systemSettings: {
    maintenance: boolean;
    registration: boolean;
    notifications: boolean;
    term: string;
  };

  // Actions
  initialize: () => Promise<void>;
  refreshData: () => void;
  updateSystemSettings: (settings: Partial<AppState['systemSettings']>) => void;

  // Student actions
  addStudent: (data: { name: string; email: string; program: string; phone?: string; dateOfBirth?: string; address?: string; status?: string }) => { success: boolean; errors?: string[] };
  deleteStudent: (studentId: string) => boolean;
  updateStudentStatus: (studentId: string, status: string) => boolean;
  updateStudentProfile: (studentId: string, data: Partial<{ name: string; email: string; program: string; status: string }>) => boolean;
  importStudents: (students: any[]) => void;
  toggleUserLock: (email: string) => boolean;
  
  // Faculty actions
  addFaculty: (data: { name: string; email: string; phone?: string; department?: string }) => { success: boolean; errors?: string[] };
  updateFaculty: (id: string, data: Partial<{ name: string; email: string; phone: string; isActive: boolean }>) => boolean;
  deleteFaculty: (id: string) => boolean;

  // Course actions
  addCourse: (data: { code: string; name: string; instructor: string; schedule: string; credits: number; capacity?: number; department?: string }) => { success: boolean; errors?: string[] };
  updateCourseInstructor: (courseId: string, newInstructor: string) => boolean;
  updateCourse: (courseId: string, data: Partial<{ name: string; instructor: string; schedule: string; credits: number; capacity: number; department: string }>) => boolean;
  deleteCourse: (courseId: string) => boolean;

  // Enrollment actions
  assignStudentsToCourse: (studentIds: string[], courseId: string) => { success: boolean; enrolled: number; errors: string[] };
  removeStudentFromCourse: (studentId: string, courseId: string) => boolean;

  // Grade actions
  updateGrade: (studentId: string, courseId: string, type: 'assignment' | 'midterm' | 'final', value: number) => boolean;

  // Department actions
  addDepartment: (data: { name: string; head: string; description: string; facultyCount?: number }) => { success: boolean; errors?: string[] };
  updateDepartment: (id: string, data: Partial<{ name: string; head: string; description: string; facultyCount: number }>) => boolean;
  deleteDepartment: (id: string) => boolean;

  // User actions
  updateUserProfile: (email: string, data: { phone?: string; password?: string }) => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  students: [],
  courses: [],
  enrollments: [],
  grades: [],
  departments: [],
  faculty: [],
  isInitialized: false,
  systemSettings: JSON.parse(localStorage.getItem('elevate_system_settings') || 'null') || {
    maintenance: false,
    registration: true,
    notifications: true,
    term: 'Fall 2024'
  },

  initialize: async () => {
    if (get().isInitialized) return;

    const facade = AppFacade.getInstance();
    await facade.seedInitialData();

    set({
      students: facade.getAllStudents(),
      courses: facade.getAllCourses(),
      enrollments: facade.getEnrollments(),
      grades: facade.getAllGrades(),
      departments: facade.getAllDepartments ? facade.getAllDepartments() : [],
      faculty: facade.getAllFaculty(),
      isInitialized: true,
    });
  },

  refreshData: () => {
    const facade = AppFacade.getInstance();
    set({
      students: facade.getAllStudents(),
      courses: facade.getAllCourses(),
      enrollments: facade.getEnrollments(),
      grades: facade.getAllGrades(),
      departments: facade.getAllDepartments ? facade.getAllDepartments() : [],
      faculty: facade.getAllFaculty(),
    });
  },

  updateSystemSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.systemSettings, ...newSettings };
      localStorage.setItem('elevate_system_settings', JSON.stringify(updated));
      return { systemSettings: updated };
    });
  },

  // --- Student Actions ---

  addStudent: (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized Action: Admin privileges required'] };
    const facade = AppFacade.getInstance();
    const result = facade.registerStudent(data);
    if (result.success) {
      set({ students: facade.getAllStudents() });
    }
    return result;
  },

  deleteStudent: (studentId) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.deleteStudent(studentId);
    if (success) {
      set({
        students: facade.getAllStudents(),
        enrollments: facade.getEnrollments(),
        grades: facade.getAllGrades(),
      });
    }
    return success;
  },

  updateStudentStatus: (studentId, status) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateStudentStatus(studentId, status);
    if (success) {
      set({ students: facade.getAllStudents() });
    }
    return success;
  },

  updateStudentProfile: (studentId, data) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateStudentProfile(studentId, data);
    if (success) {
      set({ students: facade.getAllStudents() });
    }
    return success;
  },

  importStudents: (students) => {
    if (!requireRoles(['Admin'])) return;
    const facade = AppFacade.getInstance();
    // Convert plain objects to CSV and import
    for (const s of students) {
      facade.registerStudent({
        name: s.name,
        email: s.email,
        program: s.program || 'Software Engineering',
        phone: s.phone,
        dateOfBirth: s.dateOfBirth,
        address: s.address,
      });
    }
    set({ students: facade.getAllStudents() });
  },

  toggleUserLock: (email) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.toggleUserLock(email);
    if (success) {
      set({
        students: facade.getAllStudents(),
        faculty: facade.getAllFaculty(),
      });
    }
    return success;
  },

  // --- Faculty Actions ---

  addFaculty: (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized Action'] };
    const facade = AppFacade.getInstance();
    const result = facade.addFaculty(data);
    if (result.success) {
      set({ faculty: facade.getAllFaculty() });
    }
    return result;
  },

  updateFaculty: (id, data) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateFaculty(id, data);
    if (success) {
      set({ faculty: facade.getAllFaculty() });
    }
    return success;
  },

  deleteFaculty: (id) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.deleteFaculty(id);
    if (success) {
      set({ faculty: facade.getAllFaculty() });
    }
    return success;
  },

  // --- Course Actions ---

  addCourse: (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized Action: Admin privileges required'] };
    const facade = AppFacade.getInstance();
    const result = facade.createCourse(data);
    if (result.success) {
      set({ courses: facade.getAllCourses() });
    }
    return result;
  },

  updateCourseInstructor: (courseId, newInstructor) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateCourseInstructor(courseId, newInstructor);
    if (success) {
      set({ courses: facade.getAllCourses() });
    }
    return success;
  },

  updateCourse: (courseId, data) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateCourse(courseId, data);
    if (success) {
      set({ courses: facade.getAllCourses() });
    }
    return success;
  },

  deleteCourse: (courseId) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.deleteCourse(courseId);
    if (success) {
      set({
        courses: facade.getAllCourses(),
        enrollments: facade.getEnrollments(),
      });
    }
    return success;
  },

  // --- Enrollment Actions ---

  assignStudentsToCourse: (studentIds, courseId) => {
    if (!requireRoles(['Admin'])) return { success: false, enrolled: 0, errors: ['Unauthorized Action: Admin privileges required'] };
    const facade = AppFacade.getInstance();
    const result = facade.enrollStudents(courseId, studentIds);
    if (result.enrolled > 0) {
      set({
        enrollments: facade.getEnrollments(),
        courses: facade.getAllCourses(),
        grades: facade.getAllGrades(),
      });
    }
    return result;
  },

  removeStudentFromCourse: (studentId, courseId) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.unenrollStudent(courseId, studentId);
    if (success) {
      set({
        enrollments: facade.getEnrollments(),
        courses: facade.getAllCourses(),
      });
    }
    return success;
  },

  // --- Grade Actions ---

  updateGrade: (studentId, courseId, type, value) => {
    if (!requireRoles(['Faculty', 'Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateGrade(studentId, courseId, type, value);
    if (success) {
      set({ grades: facade.getAllGrades() });
    }
    return success;
  },

  // --- Department Actions ---

  addDepartment: (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized Action'] };
    const facade = AppFacade.getInstance();
    const result = facade.createDepartment(data);
    if (result.success) {
      set({ departments: facade.getAllDepartments() });
    }
    return result;
  },

  updateDepartment: (id, data) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.updateDepartment(id, data);
    if (success) {
      set({ departments: facade.getAllDepartments() });
    }
    return success;
  },

  deleteDepartment: (id) => {
    if (!requireRoles(['Admin'])) return false;
    const facade = AppFacade.getInstance();
    const success = facade.deleteDepartment(id);
    if (success) {
      set({ departments: facade.getAllDepartments() });
    }
    return success;
  },



  updateUserProfile: async (email, data) => {
    const facade = AppFacade.getInstance();
    const success = (facade as any).updateUserProfile ? await (facade as any).updateUserProfile(email, data) : false;
    return success;
  },
}));
