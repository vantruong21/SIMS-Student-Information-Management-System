/**
 * ICsvSerializer — CSV Serialization Interface
 * 
 * SOLID — Interface Segregation: Focused only on CSV parsing/stringifying.
 */
export interface ICsvSerializer {
  /** Parses a CSV string into an array of string arrays (rows of columns). */
  parse(csvContent: string): string[][];

  /** Converts an array of string arrays into a CSV string. */
  stringify(data: string[][], header?: string): string;

  /** Validates CSV structure against expected column count. */
  validateStructure(csvContent: string, expectedColumns: number): { valid: boolean; errors: string[] };
}

/**
 * IStudentService — Student Business Logic Interface
 * 
 * SOLID — Single Responsibility: Only student business operations.
 * SOLID — Interface Segregation: Separate from repository concerns.
 */
export interface IStudentService {
  /** Registers a new student with validation. */
  register(data: {
    name: string;
    email: string;
    program: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
  }): { success: boolean; studentId?: string; errors?: string[] };

  /** Approves a pending student. */
  approve(studentId: string): boolean;

  /** Suspends a student. */
  suspend(studentId: string): boolean;

  /** Deletes a student and all related records. */
  delete(studentId: string): boolean;

  /** Searches students by query string. */
  search(query: string, status?: string): any[];

  /** Gets paginated student list. */
  getPaginated(page: number, pageSize: number, search?: string, status?: string): {
    students: any[];
    total: number;
    totalPages: number;
  };

  /** Calculates GPA for a student based on grades. */
  calculateGpa(studentId: string): number;

  /** Imports students from CSV. Returns count of successfully imported. */
  importFromCsv(csvContent: string): { imported: number; errors: string[] };

  /** Exports all students as CSV string. */
  exportToCsv(): string;
}

/**
 * ICourseService — Course Business Logic Interface
 */
export interface ICourseService {
  /** Creates a new course. */
  create(data: { code: string; name: string; instructor: string; schedule: string; credits: number; capacity?: number; department?: string }): { success: boolean; courseId?: string; errors?: string[] };

  /** Updates an existing course. */
  update(courseId: string, data: Partial<{ code: string; name: string; instructor: string; schedule: string; credits: number; capacity: number }>): boolean;

  /** Deletes a course and related enrollments. */
  delete(courseId: string): boolean;

  /** Enrolls students into a course. */
  enrollStudents(courseId: string, studentIds: string[]): { success: boolean; enrolled: number; errors: string[] };

  /** Removes a student from a course. */
  unenrollStudent(courseId: string, studentId: string): boolean;

  /** Gets students enrolled in a course. */
  getEnrolledStudents(courseId: string): any[];

  /** Gets courses a student is enrolled in. */
  getStudentCourses(studentId: string): any[];
}

/**
 * INotificationService — Notification Interface
 * 
 * SOLID — Interface Segregation: Only notification concerns.
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface INotificationService {
  /** Shows a notification. */
  show(message: string, type?: NotificationType, duration?: number): void;

  /** Clears current notification. */
  clear(): void;

  /** Subscribes to notifications. */
  subscribe(callback: (message: string, type: NotificationType) => void): () => void;
}

/**
 * IValidator — Validation Strategy Interface
 * 
 * DESIGN PATTERN: Strategy Pattern — different validation strategies can be swapped.
 */
export interface IValidator<T> {
  /** Validates the data and returns array of error messages. Empty = valid. */
  validate(data: T): string[];
}
