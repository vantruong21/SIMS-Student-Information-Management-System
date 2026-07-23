import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import {
  studentsApi,
  facultyApi,
  coursesApi,
  departmentsApi,
  enrollmentsApi,
  gradesApi,
} from '../api';

/**
 * useAppStore — Application State Management kết nối trực tiếp C# Backend API.
 *
 * Thay thế hoàn toàn AppFacade → localStorage/CSV.
 * Mọi thao tác CRUD đều gọi API → MySQL (qua Backend C#).
 *
 * SOLID — Single Responsibility: quản lý state ứng dụng.
 * SOLID — Dependency Inversion: phụ thuộc vào api.ts abstraction.
 */

// ─── RBAC Guard ───────────────────────────────────────────────────────────────
const requireRoles = (roles: string[]): boolean => {
  const role = useAuthStore.getState().user?.role;
  if (!role || !roles.includes(role)) {
    console.error(`[RBAC BLOCK] Required: ${roles.join('/')}, Got: ${role || 'Anonymous'}`);
    return false;
  }
  return true;
};

// ─── State Interface ──────────────────────────────────────────────────────────

interface AppState {
  students: any[];
  courses: any[];
  enrollments: any[];
  grades: any[];
  departments: any[];
  faculty: any[];
  isInitialized: boolean;
  isLoading: boolean;
  systemSettings: {
    maintenance: boolean;
    registration: boolean;
    notifications: boolean;
    term: string;
  };

  // Core
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateSystemSettings: (settings: Partial<AppState['systemSettings']>) => void;

  // Student
  addStudent: (data: {
    name: string; email: string; program: string;
    phone?: string; dateOfBirth?: string; address?: string; status?: string;
  }) => Promise<{ success: boolean; errors?: string[] }>;
  deleteStudent: (studentId: string) => Promise<boolean>;
  updateStudentStatus: (studentId: string, status: string) => Promise<boolean>;
  updateStudentProfile: (studentId: string, data: Partial<{
    name: string; email: string; program: string; status: string;
  }>) => Promise<boolean>;
  importStudents: (students: any[]) => Promise<void>;
  toggleUserLock: (email: string) => Promise<boolean>;

  // Faculty
  addFaculty: (data: {
    name: string; email: string; phone?: string; department?: string;
  }) => Promise<{ success: boolean; errors?: string[] }>;
  updateFaculty: (id: string, data: Partial<{
    name: string; email: string; phone: string; isActive: boolean;
  }>) => Promise<boolean>;
  deleteFaculty: (id: string) => Promise<boolean>;

  // Course
  addCourse: (data: {
    code: string; name: string; instructor: string; schedule: string;
    credits: number; capacity?: number; department?: string;
  }) => Promise<{ success: boolean; errors?: string[] }>;
  updateCourseInstructor: (courseId: string, instructor: string) => Promise<boolean>;
  updateCourse: (courseId: string, data: Partial<{
    name: string; instructor: string; schedule: string;
    credits: number; capacity: number; department: string;
  }>) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;

  // Enrollment
  assignStudentsToCourse: (studentIds: string[], courseId: string) => Promise<{
    success: boolean; enrolled: number; errors: string[];
  }>;
  removeStudentFromCourse: (studentId: string, courseId: string) => Promise<boolean>;

  // Grade
  updateGrade: (
    studentId: string, courseId: string,
    type: 'assignment' | 'midterm' | 'final', value: number
  ) => Promise<boolean>;

  // Department
  addDepartment: (data: {
    name: string; head: string; description: string; facultyCount?: number;
  }) => Promise<{ success: boolean; errors?: string[] }>;
  updateDepartment: (id: string, data: Partial<{
    name: string; head: string; description: string; facultyCount: number;
  }>) => Promise<boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;

  // User profile
  updateUserProfile: (email: string, data: { phone?: string; password?: string }) => Promise<boolean>;
}

// ─── Store Implementation ─────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  students: [],
  courses: [],
  enrollments: [],
  grades: [],
  departments: [],
  faculty: [],
  isInitialized: false,
  isLoading: false,
  systemSettings: JSON.parse(localStorage.getItem('elevate_system_settings') || 'null') || {
    maintenance: false,
    registration: true,
    notifications: true,
    term: 'Fall 2024',
  },

  // ── Initialize (gọi khi app khởi động, sau khi đăng nhập) ────────────────
  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const [students, courses, departments, faculty, enrollments, grades] = await Promise.all([
        studentsApi.getAll().catch(() => []),
        coursesApi.getAll().catch(() => []),
        departmentsApi.getAll().catch(() => []),
        facultyApi.getAll().catch(() => []),
        enrollmentsApi.getAll().catch(() => []),
        gradesApi.getAll().catch(() => []),
      ]);
      set({ students, courses, departments, faculty, enrollments, grades, isInitialized: true, isLoading: false });
    } catch {
      set({ isInitialized: true, isLoading: false });
    }
  },

  // ── Refresh all data from API ─────────────────────────────────────────────
  refreshData: async () => {
    set({ isLoading: true });
    try {
      const [students, courses, departments, faculty, enrollments, grades] = await Promise.all([
        studentsApi.getAll().catch(() => get().students),
        coursesApi.getAll().catch(() => get().courses),
        departmentsApi.getAll().catch(() => get().departments),
        facultyApi.getAll().catch(() => get().faculty),
        enrollmentsApi.getAll().catch(() => get().enrollments),
        gradesApi.getAll().catch(() => get().grades),
      ]);
      set({ students, courses, departments, faculty, enrollments, grades, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateSystemSettings: (newSettings) => {
    set((state) => {
      const updated = { ...state.systemSettings, ...newSettings };
      localStorage.setItem('elevate_system_settings', JSON.stringify(updated));
      return { systemSettings: updated };
    });
  },

  // ── Student Actions ───────────────────────────────────────────────────────

  addStudent: async (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized'] };
    try {
      await studentsApi.create(data);
      const students = await studentsApi.getAll();
      set({ students });
      return { success: true };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  },

  deleteStudent: async (id) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await studentsApi.delete(id);
      set((s) => ({ students: s.students.filter((x) => x.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },

  updateStudentStatus: async (id, status) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await studentsApi.updateStatus(id, status);
      const students = await studentsApi.getAll();
      set({ students });
      return true;
    } catch {
      return false;
    }
  },

  updateStudentProfile: async (id, data) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await studentsApi.update(id, data);
      const students = await studentsApi.getAll();
      set({ students });
      return true;
    } catch {
      return false;
    }
  },

  importStudents: async (items) => {
    if (!requireRoles(['Admin'])) return;
    for (const s of items) {
      try {
        await studentsApi.create({
          name: s.name, email: s.email,
          program: s.program || 'Software Engineering',
          phone: s.phone, dateOfBirth: s.dateOfBirth, address: s.address,
        });
      } catch { /* skip duplicates */ }
    }
    const students = await studentsApi.getAll();
    set({ students });
  },

  toggleUserLock: async (email) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      // Find id from current state
      const found = [...get().students, ...get().faculty].find((x) => x.email === email);
      if (!found) return false;
      if (get().students.find((x) => x.email === email)) {
        await studentsApi.toggleLock(found.id, email);
      } else {
        await facultyApi.toggleLock(found.id, email);
      }
      const [students, faculty] = await Promise.all([studentsApi.getAll(), facultyApi.getAll()]);
      set({ students, faculty });
      return true;
    } catch {
      return false;
    }
  },

  // ── Faculty Actions ───────────────────────────────────────────────────────

  addFaculty: async (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized'] };
    try {
      await facultyApi.create(data);
      const faculty = await facultyApi.getAll();
      set({ faculty });
      return { success: true };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  },

  updateFaculty: async (id, data) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await facultyApi.update(id, data);
      const faculty = await facultyApi.getAll();
      set({ faculty });
      return true;
    } catch {
      return false;
    }
  },

  deleteFaculty: async (id) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await facultyApi.delete(id);
      set((s) => ({ faculty: s.faculty.filter((x) => x.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },

  // ── Course Actions ────────────────────────────────────────────────────────

  addCourse: async (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized'] };
    try {
      await coursesApi.create(data);
      const courses = await coursesApi.getAll();
      set({ courses });
      return { success: true };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  },

  updateCourseInstructor: async (id, instructor) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await coursesApi.updateInstructor(id, instructor);
      const courses = await coursesApi.getAll();
      set({ courses });
      return true;
    } catch {
      return false;
    }
  },

  updateCourse: async (id, data) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await coursesApi.update(id, data);
      const courses = await coursesApi.getAll();
      set({ courses });
      return true;
    } catch {
      return false;
    }
  },

  deleteCourse: async (id) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await coursesApi.delete(id);
      const [courses, enrollments] = await Promise.all([
        coursesApi.getAll(), enrollmentsApi.getAll()
      ]);
      set({ courses, enrollments });
      return true;
    } catch {
      return false;
    }
  },

  // ── Enrollment Actions ────────────────────────────────────────────────────

  assignStudentsToCourse: async (studentIds, courseId) => {
    if (!requireRoles(['Admin'])) return { success: false, enrolled: 0, errors: ['Unauthorized'] };
    try {
      const result = await enrollmentsApi.assign(courseId, studentIds);
      const [enrollments, courses] = await Promise.all([
        enrollmentsApi.getAll(), coursesApi.getAll()
      ]);
      set({ enrollments, courses });
      return result;
    } catch (err: any) {
      return { success: false, enrolled: 0, errors: [err.message] };
    }
  },

  removeStudentFromCourse: async (studentId, courseId) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await enrollmentsApi.remove(studentId, courseId);
      const [enrollments, courses] = await Promise.all([
        enrollmentsApi.getAll(), coursesApi.getAll()
      ]);
      set({ enrollments, courses });
      return true;
    } catch {
      return false;
    }
  },

  // ── Grade Actions ─────────────────────────────────────────────────────────

  updateGrade: async (studentId, courseId, type, value) => {
    if (!requireRoles(['Faculty', 'Admin'])) return false;
    try {
      await gradesApi.update(studentId, courseId, type, value);
      const grades = await gradesApi.getAll();
      set({ grades });
      return true;
    } catch {
      return false;
    }
  },

  // ── Department Actions ────────────────────────────────────────────────────

  addDepartment: async (data) => {
    if (!requireRoles(['Admin'])) return { success: false, errors: ['Unauthorized'] };
    try {
      await departmentsApi.create(data);
      const departments = await departmentsApi.getAll();
      set({ departments });
      return { success: true };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  },

  updateDepartment: async (id, data) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await departmentsApi.update(id, data);
      const departments = await departmentsApi.getAll();
      set({ departments });
      return true;
    } catch {
      return false;
    }
  },

  deleteDepartment: async (id) => {
    if (!requireRoles(['Admin'])) return false;
    try {
      await departmentsApi.delete(id);
      set((s) => ({ departments: s.departments.filter((x) => x.id !== id) }));
      return true;
    } catch {
      return false;
    }
  },

  // ── User Profile ──────────────────────────────────────────────────────────

  updateUserProfile: async (_email, data) => {
    try {
      await import('../api').then((m) => m.authApi.updateProfile(data.phone, data.password));
      return true;
    } catch {
      return false;
    }
  },
}));
