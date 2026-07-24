/**
 * api.ts — Centralized HTTP Client cho SIMS Backend C# API
 *
 * Tất cả request đều gửi tới: http://localhost:5000/api
 * Bearer JWT Token được tự động đính kèm vào mọi request.
 *
 * SOLID — Single Responsibility: chỉ chịu trách nhiệm giao tiếp HTTP với Backend.
 * SOLID — Open/Closed: thêm endpoint mới không cần sửa hàm cũ.
 */

const BASE_URL = 'http://localhost:5000/api';

const TOKEN_KEY = 'sims_jwt_token';

// ─── Token Helpers ────────────────────────────────────────────────────────────

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      // Backend có thể trả về { error: '...' } hoặc { errors: ['...', ...] }
      if (errorBody.error) errorMsg = errorBody.error;
      else if (errorBody.errors && Array.isArray(errorBody.errors)) errorMsg = errorBody.errors[0];
      else if (errorBody.message) errorMsg = errorBody.message;
      else if (typeof errorBody === 'string') errorMsg = errorBody;
    } catch {
      // ignore parse error
    }
    console.error(`[API Error] ${response.status} ${response.url}: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Handle 204 No Content or empty body
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

const get = <T>(endpoint: string) => request<T>(endpoint);
const post = <T>(endpoint: string, body: unknown) =>
  request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
const put = <T>(endpoint: string, body: unknown) =>
  request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
const patch = <T>(endpoint: string, body?: unknown) =>
  request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
const del = <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' });

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    post<{ token: string; user: import('./types').UserProfile }>('/auth/login', { email, password }),
  updateProfile: (phone?: string, password?: string) =>
    put<void>('/auth/profile', { phone, password }),
};

// ─── STUDENTS ─────────────────────────────────────────────────────────────────

export const studentsApi = {
  getAll: () => get<import('./types').Student[]>('/students'),
  getById: (id: string) => get<import('./types').Student>(`/students/${id}`),
  create: (data: {
    name: string; email: string; program: string;
    phone?: string; dateOfBirth?: string; address?: string; status?: string; password?: string;
  }) => post<void>('/students', data),
  /** Public self-registration (no auth required). Always sets status=Pending. */
  register: (data: {
    name: string; email: string; program: string;
    phone?: string; address?: string; password: string;
  }) => post<void>('/students/register', data),
  update: (id: string, data: { name?: string; email?: string; program?: string; status?: string }) =>
    put<void>(`/students/${id}`, data),
  delete: (id: string) => del<void>(`/students/${id}`),
  updateStatus: (id: string, status: string) =>
    patch<void>(`/students/${id}/status`, { status }),
  toggleLock: (id: string, email: string) =>
    patch<void>(`/students/${id}/lock`, { email }),
  getCourses: (id: string) => get<import('./types').Course[]>(`/students/${id}/courses`),
  getGrades: (id: string) => get<import('./types').Grade[]>(`/students/${id}/grades`),
  getGpa: (id: string) => get<{ gpa: number }>(`/students/${id}/gpa`),
};

// ─── FACULTY ─────────────────────────────────────────────────────────────────

export const facultyApi = {
  getAll: () => get<import('./types').Faculty[]>('/faculty'),
  create: (data: { name: string; email: string; phone?: string; department?: string }) =>
    post<void>('/faculty', data),
  update: (id: string, data: { name?: string; email?: string; phone?: string; isActive?: boolean }) =>
    put<void>(`/faculty/${id}`, data),
  delete: (id: string) => del<void>(`/faculty/${id}`),
  toggleLock: (id: string, email: string) =>
    patch<void>(`/faculty/${id}/lock`, { email }),
};

// ─── COURSES ──────────────────────────────────────────────────────────────────

export const coursesApi = {
  getAll: () => get<import('./types').Course[]>('/courses'),
  getEnrolledStudents: (courseId: string) =>
    get<{ studentId: string; studentName: string; studentCode: string; program: string; enrollmentStatus: string }[]>(
      `/courses/${courseId}/students`
    ),
  create: (data: {
    code: string; name: string; instructor: string;
    schedule: string; credits: number; capacity?: number; department?: string;
  }) => post<void>('/courses', data),
  update: (id: string, data: {
    name?: string; instructor?: string; schedule?: string;
    credits?: number; capacity?: number; department?: string;
  }) => put<void>(`/courses/${id}`, data),
  delete: (id: string) => del<void>(`/courses/${id}`),
  updateInstructor: (id: string, instructor: string) =>
    patch<void>(`/courses/${id}/instructor`, { instructor }),
};


// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────

export const departmentsApi = {
  getAll: () => get<import('./types').Department[]>('/departments'),
  create: (data: { name: string; head: string; description: string; facultyCount?: number; facultyIds?: string[] }) =>
    post<void>('/departments', data),
  update: (id: string, data: { name?: string; head?: string; description?: string; facultyCount?: number; facultyIds?: string[] }) =>
    put<void>(`/departments/${id}`, data),
  delete: (id: string) => del<void>(`/departments/${id}`),
};


// ─── ENROLLMENTS ──────────────────────────────────────────────────────────────

export const enrollmentsApi = {
  getAll: () => get<{ 
    id: string; 
    studentId: string; 
    courseId: string; 
    enrolledAt: string; 
    status: string;
    assignmentScore?: number;
    midtermScore?: number;
    finalScore?: number;
    totalGrade?: number;
  }[]>('/enrollments'),
  assign: (courseId: string, studentIds: string[]) =>
    post<{ success: boolean; enrolled: number; errors: string[] }>('/enrollments/assign', { courseId, studentIds }),
  remove: (studentId: string, courseId: string) =>
    del<void>(`/enrollments/${studentId}/${courseId}`),
};

// ─── GRADES ───────────────────────────────────────────────────────────────────

export const gradesApi = {
  getAll: () => get<import('./types').Grade[]>('/grades'),
  update: (studentId: string, courseId: string, type: 'assignment' | 'midterm' | 'final', value: number) =>
    put<void>('/grades', { studentId, courseId, type, value }),
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────

export type AttendanceStatus = 'Present' | 'Late' | 'Absent';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  status: AttendanceStatus;
  attendedDate: string;
  reason?: string | null;
}

export interface AttendanceSummary {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalSessions: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
}

export const attendanceApi = {
  /** Faculty/Admin freeze attendance → lưu DB */
  save: (courseId: string, facultyId: string, entries: { studentId: string; status: AttendanceStatus }[]) =>
    post<{ message: string }>('/attendance/save', { courseId, facultyId, entries }),

  /** Student xem lịch sử từng buổi điểm danh */
  getByStudent: (studentId: string) =>
    get<AttendanceRecord[]>(`/attendance/student/${studentId}`),

  /** Student xem tóm tắt chuyên cần theo môn */
  getSummaryByStudent: (studentId: string) =>
    get<AttendanceSummary[]>(`/attendance/student/${studentId}/summary`),

  /** Admin/Faculty xem điểm danh theo môn học */
  getByCourse: (courseId: string) =>
    get<AttendanceRecord[]>(`/attendance/course/${courseId}`),
};
