import { StudentModel, Program, StudentStatus } from '../models/Student';
import { CourseModel, CourseStatus } from '../models/Course';
import { UserModel, UserRole } from '../models/User';
import { EnrollmentModel } from '../models/Enrollment';
import { GradeModel } from '../models/Grade';
import { DepartmentModel } from '../models/Department';

/**
 * EntityFactory — Centralized Entity Creation
 * 
 * DESIGN PATTERN: Factory Pattern
 * Encapsulates the logic of creating domain entities with proper defaults,
 * ID generation, and initial validation.
 * 
 * SOLID — Single Responsibility: Only responsible for entity instantiation.
 * SOLID — Open/Closed: New entity types can be added via new factory methods
 *         without modifying existing ones.
 */
export class EntityFactory {
  private static _idCounter: number = 0;

  /**
   * Generates a unique ID with a given prefix.
   */
  private static generateId(prefix: string): string {
    EntityFactory._idCounter++;
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${timestamp}${random}`;
  }

  /**
   * Creates a new Student entity with generated ID and defaults.
   */
  public static createStudent(data: {
    name: string;
    email: string;
    program?: Program;
    status?: StudentStatus;
    gpa?: number;
    totalCredits?: number;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
  }): StudentModel {
    const student = new StudentModel(
      EntityFactory.generateId('STD'),
      data.name,
      data.email,
      data.program || 'Software Engineering',
      data.status || 'Pending',
      data.gpa || 0,
      data.totalCredits || 0,
      undefined,  // avatarUrl
      undefined,  // grade
      data.phone,
      data.dateOfBirth,
      data.address
    );

    // Validate before returning
    const errors = student.validate();
    if (errors.length > 0) {
      throw new Error(`Invalid student data: ${errors.join(', ')}`);
    }

    return student;
  }

  /**
   * Creates a new Course entity.
   */
  public static createCourse(data: {
    code: string;
    name: string;
    instructor: string;
    schedule: string;
    status?: CourseStatus;
    credits?: number;
    capacity?: number;
    description?: string;
    department?: string;
  }): CourseModel {
    const course = new CourseModel(
      EntityFactory.generateId('CRS'),
      data.code.toUpperCase(),
      data.name,
      data.instructor,
      data.schedule,
      data.status || 'Upcoming',
      data.credits || 3,
      data.capacity || 35,
      0,
      data.description || '',
      data.department || ''
    );

    const errors = course.validate();
    if (errors.length > 0) {
      throw new Error(`Invalid course data: ${errors.join(', ')}`);
    }

    return course;
  }

  /**
   * Creates a new User entity with password hash.
   */
  public static createUser(data: {
    name: string;
    email: string;
    role: UserRole;
    passwordHash: string;
    avatarUrl?: string;
  }): UserModel {
    const user = new UserModel(
      EntityFactory.generateId('USR'),
      data.name,
      data.email,
      data.role,
      data.passwordHash,
      data.avatarUrl || ''
    );

    const errors = user.validate();
    if (errors.length > 0) {
      throw new Error(`Invalid user data: ${errors.join(', ')}`);
    }

    return user;
  }

  /**
   * Creates a new Enrollment (student ↔ course association).
   */
  public static createEnrollment(studentId: string, courseId: string): EnrollmentModel {
    return new EnrollmentModel(
      EntityFactory.generateId('ENR'),
      studentId,
      courseId
    );
  }

  /**
   * Creates a new Grade entry.
   */
  public static createGrade(studentId: string, courseId: string): GradeModel {
    return new GradeModel(
      EntityFactory.generateId('GRD'),
      studentId,
      courseId,
      0, 0, 0, ''
    );
  }

  /**
   * Creates a new Department entity.
   */
  public static createDepartment(data: {
    name: string;
    head: string;
    description: string;
    facultyCount?: number;
  }): DepartmentModel {
    return new DepartmentModel(
      EntityFactory.generateId('DPT'),
      data.name,
      data.head,
      data.description,
      data.facultyCount || 0
    );
  }
}
