import { CsvRepository } from './CsvRepository';
import { StudentModel } from '../models/Student';

/**
 * StudentRepository — Concrete Repository for Student entities
 * 
 * DESIGN PATTERN: Repository Pattern — concrete implementation
 * OOP — Inheritance: Extends CsvRepository<StudentModel>
 * SOLID — Liskov Substitution: Can be used wherever IRepository<StudentModel> is expected
 */
export class StudentRepository extends CsvRepository<StudentModel> {
  constructor() {
    super('elevate_students_csv');
  }

  protected fromCsvRow(row: string[]): StudentModel {
    return StudentModel.fromCsvRow(row);
  }

  protected getCsvHeader(): string {
    return StudentModel.getCsvHeader();
  }

  /**
   * Finds students by program.
   */
  public findByProgram(program: string): StudentModel[] {
    return this.find(s => s.program === program);
  }

  /**
   * Finds students by status.
   */
  public findByStatus(status: string): StudentModel[] {
    return this.find(s => s.status === status);
  }

  /**
   * Searches students by name, email, or ID.
   */
  public search(query: string): StudentModel[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();

    return this.find(s =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.program.toLowerCase().includes(q)
    );
  }

  /**
   * Checks if a student email already exists (for duplicate prevention).
   */
  public emailExists(email: string): boolean {
    return this.find(s => s.email.toLowerCase() === email.toLowerCase()).length > 0;
  }
}

// --- Concrete Repositories for other entity types ---

import { CourseModel } from '../models/Course';

export class CourseRepository extends CsvRepository<CourseModel> {
  constructor() {
    super('elevate_courses_csv');
  }

  protected fromCsvRow(row: string[]): CourseModel {
    return CourseModel.fromCsvRow(row);
  }

  protected getCsvHeader(): string {
    return CourseModel.getCsvHeader();
  }

  public findByCode(code: string): CourseModel | null {
    return this.find(c => c.code.toUpperCase() === code.toUpperCase())[0] || null;
  }

  public codeExists(code: string): boolean {
    return this.find(c => c.code.toUpperCase() === code.toUpperCase()).length > 0;
  }
}

import { UserModel } from '../models/User';

export class UserRepository extends CsvRepository<UserModel> {
  constructor() {
    super('elevate_users_csv');
  }

  protected fromCsvRow(row: string[]): UserModel {
    return UserModel.fromCsvRow(row);
  }

  protected getCsvHeader(): string {
    return UserModel.getCsvHeader();
  }

  public findByEmail(email: string): UserModel | null {
    return this.find(u => u.email.toLowerCase() === email.toLowerCase())[0] || null;
  }

  public emailExists(email: string): boolean {
    return this.find(u => u.email.toLowerCase() === email.toLowerCase()).length > 0;
  }
}

import { EnrollmentModel } from '../models/Enrollment';

export class EnrollmentRepository extends CsvRepository<EnrollmentModel> {
  constructor() {
    super('elevate_enrollments_csv');
  }

  protected fromCsvRow(row: string[]): EnrollmentModel {
    return EnrollmentModel.fromCsvRow(row);
  }

  protected getCsvHeader(): string {
    return EnrollmentModel.getCsvHeader();
  }

  public findByStudentId(studentId: string): EnrollmentModel[] {
    return this.find(e => e.studentId === studentId);
  }

  public findByCourseId(courseId: string): EnrollmentModel[] {
    return this.find(e => e.courseId === courseId);
  }

  public isEnrolled(studentId: string, courseId: string): boolean {
    return this.find(e => e.studentId === studentId && e.courseId === courseId).length > 0;
  }

  public getEnrolledCount(courseId: string): number {
    return this.findByCourseId(courseId).length;
  }

  public deleteByStudentId(studentId: string): number {
    const before = this.count();
    const remaining = this.getAll().filter(e => e.studentId !== studentId);
    this['saveAll'](remaining);
    return before - remaining.length;
  }

  public deleteByCourseId(courseId: string): number {
    const before = this.count();
    const remaining = this.getAll().filter(e => e.courseId !== courseId);
    this['saveAll'](remaining);
    return before - remaining.length;
  }
}

import { GradeModel } from '../models/Grade';

export class GradeRepository extends CsvRepository<GradeModel> {
  constructor() {
    super('elevate_grades_csv');
  }

  protected fromCsvRow(row: string[]): GradeModel {
    return GradeModel.fromCsvRow(row);
  }

  protected getCsvHeader(): string {
    return GradeModel.getCsvHeader();
  }

  public findByStudentId(studentId: string): GradeModel[] {
    return this.find(g => g.studentId === studentId);
  }

  public findByCourseId(courseId: string): GradeModel[] {
    return this.find(g => g.courseId === courseId);
  }

  public findByStudentAndCourse(studentId: string, courseId: string): GradeModel | null {
    return this.find(g => g.studentId === studentId && g.courseId === courseId)[0] || null;
  }

  public deleteByStudentId(studentId: string): number {
    const before = this.count();
    const remaining = this.getAll().filter(g => g.studentId !== studentId);
    this['saveAll'](remaining);
    return before - remaining.length;
  }
}
