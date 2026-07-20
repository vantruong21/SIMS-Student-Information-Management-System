import { StudentRepository, CourseRepository, UserRepository, EnrollmentRepository, GradeRepository, DepartmentRepository } from '../repositories/EntityRepositories';
import { EventBus } from '../observers/EventBus';
import { StudentModel, Program } from '../models/Student';
import { CourseModel } from '../models/Course';
import { UserModel } from '../models/User';
import { DepartmentModel } from '../models/Department';
import { EntityFactory } from '../factories/EntityFactory';
import { StudentDataValidationStrategy, PasswordValidationStrategy, EmailValidationStrategy } from '../strategies/ValidationStrategy';
import { IAuthService, AuthResult } from '../interfaces/IAuthService';
import { AppEvents } from '../observers/EventBus';

/**
 * AppFacade — Simplified API for the entire application
 * 
 * DESIGN PATTERN: Facade Pattern
 * Provides a unified, simplified interface to the complex subsystem of
 * repositories, services, factories, and validators.
 * 
 * DESIGN PATTERN: Singleton Pattern — single instance
 * 
 * SOLID — Single Responsibility: Orchestrates subsystems, doesn't implement business logic.
 * SOLID — Dependency Inversion: Components depend on AppFacade, not concrete repositories.
 */
export class AppFacade {
  private static _instance: AppFacade | null = null;

  // Repositories
  private studentRepo: StudentRepository;
  private courseRepo: CourseRepository;
  private userRepo: UserRepository;
  private enrollmentRepo: EnrollmentRepository;
  private gradeRepo: GradeRepository;
  private departmentRepo: DepartmentRepository;

  // Validators
  private studentValidator: StudentDataValidationStrategy;
  private passwordValidator: PasswordValidationStrategy;
  private emailValidator: EmailValidationStrategy;

  // Event Bus
  private eventBus: EventBus;

  private constructor() {
    this.studentRepo = new StudentRepository();
    this.courseRepo = new CourseRepository();
    this.userRepo = new UserRepository();
    this.enrollmentRepo = new EnrollmentRepository();
    this.gradeRepo = new GradeRepository();
    this.departmentRepo = new DepartmentRepository();
    this.studentValidator = new StudentDataValidationStrategy();
    this.passwordValidator = new PasswordValidationStrategy();
    this.emailValidator = new EmailValidationStrategy();
    this.eventBus = EventBus.getInstance();
  }

  public static getInstance(): AppFacade {
    if (!AppFacade._instance) {
      AppFacade._instance = new AppFacade();
    }
    return AppFacade._instance;
  }

  public static resetInstance(): void {
    AppFacade._instance = null;
  }

  // ============================
  // AUTH OPERATIONS
  // ============================

  /**
   * Hashes a password using SHA-256 via Web Crypto API.
   */
  public async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_elevate_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Authenticates a user by email and password.
   */
  public async login(email: string, password: string): Promise<AuthResult> {
    const user = this.userRepo.findByEmail(email);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account has been deactivated' };
    }

    if (user.isTemporarilyLocked()) {
      return { success: false, user: null, errors: ['Account is locked due to multiple failed login attempts. Try again later.'] };
    }

    const hash = await this.hashPassword(password);
    if (user.passwordHash !== hash) {
      user.recordFailedLogin();
      this.userRepo.update(user.id, user);
      const remaining = 5 - user.failedLoginAttempts;
      return { success: false, error: `Invalid email or password. ${remaining > 0 ? remaining + ' attempts remaining.' : 'Account locked.'}` };
    }

    // Success
    user.recordLogin();
    this.userRepo.update(user.id, user);

    const token = btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 30 * 60 * 1000 }));
    localStorage.setItem('elevate_session_token', token);
    localStorage.setItem('elevate_session_expiry', (Date.now() + 30 * 60 * 1000).toString());

    this.eventBus.publish(AppEvents.USER_LOGGED_IN, user.toProfile());

    return {
      success: true,
      user: user.toProfile(),
      token
    };
  }

  /**
   * Logs out the current user.
   */
  public logout(): void {
    localStorage.removeItem('elevate_session_token');
    localStorage.removeItem('elevate_session_expiry');
    this.eventBus.publish(AppEvents.USER_LOGGED_OUT);
  }

  /**
   * Checks if current session is valid.
   */
  public isSessionValid(): boolean {
    const expiry = localStorage.getItem('elevate_session_expiry');
    if (!expiry) return false;
    return Date.now() < parseInt(expiry);
  }

  /**
   * Validates password strength.
   */
  public validatePassword(password: string): string[] {
    return this.passwordValidator.validate(password);
  }

  // ============================
  // USER OPERATIONS
  // ============================

  public toggleUserLock(email: string): boolean {
    const user = this.userRepo.findByEmail(email);
    if (!user) return false;
    user.toggleLock();
    this.userRepo.update(user.id, user);
    return true;
  }

  public async updateUserProfile(email: string, data: { phone?: string; password?: string }): Promise<boolean> {
    const user = this.userRepo.findByEmail(email);
    if (!user) return false;
    
    if (data.phone !== undefined) {
      user.updatePhone(data.phone);
    }
    if (data.password) {
      const hash = await this.hashPassword(data.password);
      (user as any)._passwordHash = hash;
      user.touch();
    }
    
    this.userRepo.update(user.id, user);
    
    // Publish update
    this.eventBus.publish(AppEvents.USER_LOGGED_IN, user.toProfile());
    return true;
  }

  // ============================
  // STUDENT OPERATIONS
  // ============================

  public getAllStudents() {
    return this.studentRepo.getAll().map(s => s.toPlainObject());
  }

  public getStudentById(id: string) {
    return this.studentRepo.getById(id)?.toPlainObject() || null;
  }

  public registerStudent(data: { name: string; email: string; program: string; phone?: string; dateOfBirth?: string; address?: string }) {
    const errors = this.studentValidator.validate(data);
    if (errors.length > 0) return { success: false, errors };

    if (this.studentRepo.emailExists(data.email)) {
      return { success: false, errors: ['A student with this email already exists'] };
    }

    try {
      const student = EntityFactory.createStudent({
        name: data.name,
        email: data.email,
        program: data.program as Program,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address
      });

      this.studentRepo.create(student);
      this.eventBus.publish(AppEvents.STUDENT_REGISTERED, student.toPlainObject());
      return { success: true, studentId: student.id };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  }

  public approveStudent(studentId: string): boolean {
    const student = this.studentRepo.getById(studentId);
    if (!student) return false;
    try {
      student.approve();
      this.studentRepo.update(studentId, student);
      this.eventBus.publish(AppEvents.STUDENT_APPROVED, student.toPlainObject());
      return true;
    } catch {
      return false;
    }
  }

  public deleteStudent(studentId: string): boolean {
    const success = this.studentRepo.delete(studentId);
    if (success) {
      this.enrollmentRepo.deleteByStudentId(studentId);
      this.gradeRepo.deleteByStudentId(studentId);
      this.eventBus.publish(AppEvents.STUDENT_DELETED, studentId);
    }
    return success;
  }

  public updateStudentStatus(studentId: string, status: string): boolean {
    const student = this.studentRepo.getById(studentId);
    if (!student) return false;
    (student as any)._status = status;
    (student as any)._updatedAt = new Date().toISOString();
    this.studentRepo.update(studentId, student);
    return true;
  }

  public searchStudents(query: string, status?: string) {
    let results = this.studentRepo.search(query);
    if (status && status !== 'All') {
      results = results.filter(s => s.status === status);
    }
    return results.map(s => s.toPlainObject());
  }

  public importStudentsFromCsv(csvContent: string) {
    const count = this.studentRepo.importCsv(csvContent, true);
    if (count > 0) {
      this.eventBus.publish(AppEvents.STUDENT_IMPORTED, count);
    }
    return count;
  }

  public exportStudentsCsv(): string {
    return this.studentRepo.exportCsv();
  }

  // ============================
  // DEPARTMENT OPERATIONS
  // ============================

  public getAllDepartments() {
    return this.departmentRepo.getAll().map(d => d.toPlainObject());
  }

  public createDepartment(data: { name: string; head: string; description: string; facultyCount?: number }) {
    try {
      const dept = EntityFactory.createDepartment(data);
      this.departmentRepo.create(dept);
      return { success: true, departmentId: dept.id };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  }

  public updateDepartment(id: string, data: Partial<{ name: string; head: string; description: string; facultyCount: number }>): boolean {
    const dept = this.departmentRepo.getById(id);
    if (!dept) return false;
    
    if (data.name !== undefined) dept.name = data.name;
    if (data.head !== undefined) dept.head = data.head;
    if (data.description !== undefined) dept.description = data.description;
    if (data.facultyCount !== undefined) dept.facultyCount = data.facultyCount;
    
    this.departmentRepo.update(id, dept);
    return true;
  }

  public deleteDepartment(id: string): boolean {
    return this.departmentRepo.delete(id);
  }

  // ============================
  // COURSE OPERATIONS
  // ============================

  public getAllCourses() {
    const courses = this.courseRepo.getAll();
    return courses.map(c => {
      const plain = c.toPlainObject();
      plain.assignedCount = this.enrollmentRepo.getEnrolledCount(c.id);
      return plain;
    });
  }

  public createCourse(data: { code: string; name: string; instructor: string; schedule: string; credits: number; capacity?: number; department?: string }) {
    if (this.courseRepo.codeExists(data.code)) {
      return { success: false, errors: ['A course with this code already exists'] };
    }
    try {
      const course = EntityFactory.createCourse(data);
      this.courseRepo.create(course);
      this.eventBus.publish(AppEvents.COURSE_CREATED, course.toPlainObject());
      return { success: true, courseId: course.id };
    } catch (err: any) {
      return { success: false, errors: [err.message] };
    }
  }

  public deleteCourse(courseId: string): boolean {
    const success = this.courseRepo.delete(courseId);
    if (success) {
      this.enrollmentRepo.deleteByCourseId(courseId);
      this.eventBus.publish(AppEvents.COURSE_DELETED, courseId);
    }
    return success;
  }

  public updateCourse(courseId: string, data: Partial<{ name: string; instructor: string; schedule: string; credits: number; capacity: number; department: string }>): boolean {
    const course = this.courseRepo.getById(courseId);
    if (!course) return false;
    
    if (data.name !== undefined) course.name = data.name;
    if (data.instructor !== undefined) course.instructor = data.instructor;
    if (data.schedule !== undefined) course.schedule = data.schedule;
    if (data.credits !== undefined) course.credits = data.credits;
    if (data.capacity !== undefined) course.capacity = data.capacity;
    if (data.department !== undefined) course.department = data.department;

    this.courseRepo.update(courseId, course);
    this.eventBus.publish(AppEvents.COURSE_UPDATED, course.toPlainObject());
    return true;
  }

  public updateCourseInstructor(courseId: string, newInstructor: string): boolean {
    const course = this.courseRepo.getById(courseId);
    if (!course) return false;
    course.instructor = newInstructor;
    this.courseRepo.update(courseId, course);
    this.eventBus.publish(AppEvents.COURSE_UPDATED, course.toPlainObject());
    return true;
  }

  public enrollStudents(courseId: string, studentIds: string[]): { success: boolean; enrolled: number; errors: string[] } {
    const course = this.courseRepo.getById(courseId);
    if (!course) return { success: false, enrolled: 0, errors: ['Course not found'] };

    const currentCount = this.enrollmentRepo.getEnrolledCount(courseId);
    const errors: string[] = [];
    let enrolled = 0;

    for (const studentId of studentIds) {
      if (this.enrollmentRepo.isEnrolled(studentId, courseId)) {
        errors.push(`Student ${studentId} is already enrolled`);
        continue;
      }

      if (currentCount + enrolled >= course.capacity) {
        errors.push(`Course has reached maximum capacity (${course.capacity})`);
        break;
      }

      const student = this.studentRepo.getById(studentId);
      if (!student || !student.isEligibleForEnrollment()) {
        errors.push(`Student ${studentId} is not eligible for enrollment`);
        continue;
      }

      const enrollment = EntityFactory.createEnrollment(studentId, courseId);
      this.enrollmentRepo.create(enrollment);

      // Also create initial grade entry
      const grade = EntityFactory.createGrade(studentId, courseId);
      this.gradeRepo.create(grade);

      enrolled++;
    }

    if (enrolled > 0) {
      this.eventBus.publish(AppEvents.STUDENT_ENROLLED, { courseId, enrolled });
    }

    return { success: enrolled > 0, enrolled, errors };
  }

  public unenrollStudent(courseId: string, studentId: string): boolean {
    const enrollments = this.enrollmentRepo.find(e => e.studentId === studentId && e.courseId === courseId);
    if (enrollments.length === 0) return false;
    this.enrollmentRepo.delete(enrollments[0].id);
    this.eventBus.publish(AppEvents.STUDENT_UNENROLLED, { courseId, studentId });
    return true;
  }

  public getEnrolledStudents(courseId: string) {
    const enrollments = this.enrollmentRepo.findByCourseId(courseId);
    return enrollments.map(e => this.studentRepo.getById(e.studentId)?.toPlainObject()).filter(Boolean);
  }

  public getStudentCourses(studentId: string) {
    const enrollments = this.enrollmentRepo.findByStudentId(studentId);
    return enrollments.map(e => this.courseRepo.getById(e.courseId)?.toPlainObject()).filter(Boolean);
  }

  public getEnrollments() {
    return this.enrollmentRepo.getAll().map(e => e.toPlainObject());
  }

  // ============================
  // GRADE OPERATIONS
  // ============================

  public getStudentGrades(studentId: string) {
    return this.gradeRepo.findByStudentId(studentId).map(g => g.toPlainObject());
  }

  public updateGrade(studentId: string, courseId: string, type: 'assignment' | 'midterm' | 'final', value: number): boolean {
    let grade = this.gradeRepo.findByStudentAndCourse(studentId, courseId);
    if (!grade) {
      grade = EntityFactory.createGrade(studentId, courseId);
      this.gradeRepo.create(grade);
    }
    grade[type === 'final' ? 'finalScore' : type] = value;
    this.gradeRepo.update(grade.id, grade);
    this.eventBus.publish(AppEvents.GRADE_UPDATED, { studentId, courseId, type, value });
    return true;
  }

  public getAllGrades() {
    return this.gradeRepo.getAll().map(g => g.toPlainObject());
  }

  public calculateStudentGpa(studentId: string): number {
    const grades = this.gradeRepo.findByStudentId(studentId);
    if (grades.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    for (const grade of grades) {
      const course = this.courseRepo.getById(grade.courseId);
      if (course) {
        totalPoints += grade.getGpaPoints() * course.credits;
        totalCredits += course.credits;
      }
    }

    return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  }

  // ============================
  // SEED DATA
  // ============================

  public async seedInitialData(): Promise<void> {
    // Seed users if empty
    if (this.userRepo.count() === 0) {
      const adminHash = await this.hashPassword('Admin@123');
      const facultyHash = await this.hashPassword('Faculty@123');
      const studentHash = await this.hashPassword('Student@123');

      const admin = new UserModel('USR-admin-001', 'GS. Tran Hoang', 'admin@elevate.edu', 'Admin', adminHash,
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1nW0r0b5Mhu1d-72_6JqL8uTQopKz518YIviupE6f5RREs2Mw9Mh0hoX2tTXh4mx1nIS_MrOdp53iAE3wNj1inO3NR_XLfUOQZfXbAX8Dl80n8tsroJRzLY2tFrQLbb5x5uJ5rkXkrBD7Pp-mvi5RZjHMb7H_J81eVXaz6s1KEXDRMgxkvs8uKB5SZbd4PhNGqnF_yZTC7N0DkP0mUKhKY2raZH9AvM-ZGaPN3fQCEUHjEpQYW2jlw');
      const faculty = new UserModel('USR-faculty-001', 'Richard Feynman', 'feynman@elevate.edu', 'Faculty', facultyHash,
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256');
      const student = new UserModel('USR-student-001', 'John Doe', 'scholar@elevate.edu', 'Student', studentHash,
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256');

      this.userRepo.create(admin);
      this.userRepo.create(faculty);
      this.userRepo.create(student);
    }

    // Seed departments if empty
    if (this.departmentRepo.count() === 0) {
      const depts = [
        EntityFactory.createDepartment({ name: 'Khoa Công nghệ Thông tin', head: 'Dr. Turing', description: 'Đào tạo kỹ sư phần mềm, khoa học máy tính và AI.', facultyCount: 45 }),
        EntityFactory.createDepartment({ name: 'Khoa Kinh tế Quản trị', head: 'Prof. Miller', description: 'Quản trị kinh doanh, Marketing và Tài chính.', facultyCount: 30 }),
        EntityFactory.createDepartment({ name: 'Khoa Thiết kế Đồ họa', head: 'Prof. Carter', description: 'Thiết kế UI/UX, Đồ họa 2D/3D và Truyền thông.', facultyCount: 25 }),
        EntityFactory.createDepartment({ name: 'Khoa Ngoại ngữ', head: 'Dr. Jones', description: 'Đào tạo Ngôn ngữ Anh, Nhật, Hàn, Trung.', facultyCount: 40 }),
      ];
      depts.forEach(d => this.departmentRepo.create(d));
    }

    // Seed courses if empty
    if (this.courseRepo.count() === 0) {
      const courses = [
        new CourseModel('CRS-se1', 'SE101', 'Application Development', 'Dr. Smith', 'Mon/Wed 9:00 AM', 'In Progress', 3, 35, 0, '', 'Software Engineering'),
        new CourseModel('CRS-se2', 'SE102', 'Applied Programming and Design Principles', 'Dr. Jones', 'Tue/Thu 1:00 PM', 'In Progress', 4, 35, 0, '', 'Software Engineering'),
        new CourseModel('CRS-se3', 'SE103', 'Discrete Maths', 'Prof. Turing', 'Mon/Wed 2:00 PM', 'In Progress', 3, 35, 0, '', 'Software Engineering'),
        new CourseModel('CRS-mk1', 'MKT201', 'Digital Marketing Strategy', 'Prof. Miller', 'Tue/Thu 10:00 AM', 'In Progress', 3, 35, 0, '', 'Marketing'),
        new CourseModel('CRS-mk2', 'MKT202', 'Consumer Behavior', 'Dr. Davis', 'Mon/Wed 11:00 AM', 'In Progress', 3, 35, 0, '', 'Marketing'),
        new CourseModel('CRS-mk3', 'MKT203', 'Brand Management', 'Prof. Wilson', 'Fri 9:00 AM', 'In Progress', 3, 35, 0, '', 'Marketing'),
        new CourseModel('CRS-gd1', 'DES301', 'Typography Fundamentals', 'Prof. Carter', 'Mon/Wed 3:00 PM', 'In Progress', 3, 35, 0, '', 'Graphic Design'),
        new CourseModel('CRS-gd2', 'DES302', 'UI/UX Design', 'Dr. Lee', 'Tue/Thu 2:00 PM', 'In Progress', 4, 35, 0, '', 'Graphic Design'),
        new CourseModel('CRS-gd3', 'DES303', 'Color Theory', 'Prof. White', 'Fri 1:00 PM', 'In Progress', 3, 35, 0, '', 'Graphic Design'),
      ];
      courses.forEach(c => this.courseRepo.create(c));
    }

    // Seed students if empty
    if (this.studentRepo.count() === 0) {
      const seedStudents = [
        new StudentModel('STD-001', 'Alice Johnson', 'alice@elevate.edu', 'Software Engineering', 'Active', 3.85, 96),
        new StudentModel('STD-002', 'Bob Smith', 'bob@elevate.edu', 'Software Engineering', 'Active', 3.62, 84),
        new StudentModel('STD-003', 'Carol Williams', 'carol@elevate.edu', 'Marketing', 'Active', 3.91, 108),
        new StudentModel('STD-004', 'David Brown', 'david@elevate.edu', 'Graphic Design', 'Active', 3.45, 72),
        new StudentModel('STD-005', 'Emma Davis', 'emma@elevate.edu', 'Data Science', 'Active', 3.78, 90),
        new StudentModel('STD-006', 'Frank Miller', 'frank@elevate.edu', 'Software Engineering', 'Pending', 0, 0),
        new StudentModel('STD-007', 'Grace Wilson', 'grace@elevate.edu', 'Marketing', 'Active', 3.55, 66),
        new StudentModel('STD-008', 'Henry Taylor', 'henry@elevate.edu', 'Business Administration', 'Active', 3.70, 78),
        new StudentModel('STD-009', 'Ivy Anderson', 'ivy@elevate.edu', 'Graphic Design', 'Pending', 0, 0),
        new StudentModel('STD-010', 'Jack Thomas', 'jack@elevate.edu', 'Data Science', 'Active', 3.33, 54),
        new StudentModel('STD-011', 'Karen White', 'karen@elevate.edu', 'Software Engineering', 'Active', 3.92, 114),
        new StudentModel('STD-012', 'Leo Martinez', 'leo@elevate.edu', 'Marketing', 'Active', 3.48, 60),
        new StudentModel('STD-013', 'Mia Garcia', 'mia@elevate.edu', 'Graphic Design', 'Active', 3.67, 82),
        new StudentModel('STD-014', 'Noah Robinson', 'noah@elevate.edu', 'Business Administration', 'Pending', 0, 0),
        new StudentModel('STD-015', 'Olivia Clark', 'olivia@elevate.edu', 'Software Engineering', 'Active', 3.80, 100),
        new StudentModel('STD-016', 'Paul Lewis', 'paul@elevate.edu', 'Data Science', 'Active', 3.25, 48),
        new StudentModel('STD-017', 'Quinn Hall', 'quinn@elevate.edu', 'Marketing', 'Active', 3.72, 88),
        new StudentModel('STD-018', 'Rachel Young', 'rachel@elevate.edu', 'Graphic Design', 'Active', 3.58, 74),
        new StudentModel('STD-019', 'Sam King', 'sam@elevate.edu', 'Software Engineering', 'Active', 3.44, 62),
        new StudentModel('STD-020', 'Tina Wright', 'tina@elevate.edu', 'Business Administration', 'Active', 3.88, 106),
      ];
      seedStudents.forEach(s => this.studentRepo.create(s));
    }
  }

  // ============================
  // EVENT BUS ACCESS
  // ============================

  public getEventBus(): EventBus {
    return this.eventBus;
  }
}
