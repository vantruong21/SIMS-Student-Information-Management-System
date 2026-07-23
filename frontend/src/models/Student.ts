import { BaseEntity } from './BaseEntity';

/**
 * Student — Domain Model Class
 * 
 * OOP PRINCIPLES:
 * - Inheritance: Extends BaseEntity
 * - Encapsulation: Private fields with public getters/setters
 * - Polymorphism: Implements abstract methods from BaseEntity
 * 
 * SOLID — Single Responsibility: Only manages student data and student-specific logic.
 */
export type StudentStatus = 'Active' | 'Pending' | 'Suspended' | 'Graduated';
export type Program = 'Software Engineering' | 'Marketing' | 'Graphic Design' | 'Data Science' | 'Business Administration';

export class StudentModel extends BaseEntity {
  private _name: string;
  private _email: string;
  private _program: Program;
  private _status: StudentStatus;
  private _avatarUrl?: string;
  private _gpa: number;
  private _totalCredits: number;
  private _grade?: string;
  private _phone?: string;
  private _dateOfBirth?: string;
  private _address?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    program: Program,
    status: StudentStatus = 'Pending',
    gpa: number = 0,
    totalCredits: number = 0,
    avatarUrl?: string,
    grade?: string,
    phone?: string,
    dateOfBirth?: string,
    address?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    this._email = email;
    this._program = program;
    this._status = status;
    this._gpa = gpa;
    this._totalCredits = totalCredits;
    this._avatarUrl = avatarUrl;
    this._grade = grade;
    this._phone = phone;
    this._dateOfBirth = dateOfBirth;
    this._address = address;
  }

  // --- Encapsulation: Getters ---
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get program(): Program { return this._program; }
  get status(): StudentStatus { return this._status; }
  get avatarUrl(): string | undefined { return this._avatarUrl; }
  get gpa(): number { return this._gpa; }
  get totalCredits(): number { return this._totalCredits; }
  get grade(): string | undefined { return this._grade; }
  get phone(): string | undefined { return this._phone; }
  get dateOfBirth(): string | undefined { return this._dateOfBirth; }
  get address(): string | undefined { return this._address; }

  // --- Encapsulation: Setters with validation ---
  set name(value: string) {
    if (!value || value.trim().length === 0) throw new Error('Student name cannot be empty');
    this._name = value.trim();
    this.touch();
  }

  set email(value: string) {
    if (!StudentModel.isValidEmail(value)) throw new Error('Invalid email format');
    this._email = value.trim().toLowerCase();
    this.touch();
  }

  set program(value: Program) {
    this._program = value;
    this.touch();
  }

  set status(value: StudentStatus) {
    this._status = value;
    this.touch();
  }

  set gpa(value: number) {
    if (value < 0 || value > 4.0) throw new Error('GPA must be between 0 and 4.0');
    this._gpa = value;
    this.touch();
  }

  set totalCredits(value: number) {
    if (value < 0) throw new Error('Credits cannot be negative');
    this._totalCredits = value;
    this.touch();
  }

  set phone(value: string | undefined) {
    this._phone = value;
    this.touch();
  }

  set dateOfBirth(value: string | undefined) {
    this._dateOfBirth = value;
    this.touch();
  }

  set address(value: string | undefined) {
    this._address = value;
    this.touch();
  }

  // --- Business Methods ---

  /**
   * Approves a pending student registration.
   */
  public approve(): void {
    if (this._status !== 'Pending') {
      throw new Error(`Cannot approve student with status: ${this._status}`);
    }
    this._status = 'Active';
    this.touch();
  }

  /**
   * Suspends an active student.
   */
  public suspend(): void {
    if (this._status !== 'Active') {
      throw new Error(`Cannot suspend student with status: ${this._status}`);
    }
    this._status = 'Suspended';
    this.touch();
  }

  /**
   * Checks if student is eligible for course enrollment.
   */
  public isEligibleForEnrollment(): boolean {
    return this._status === 'Active';
  }

  /**
   * Calculates progress percentage toward graduation.
   */
  public getGraduationProgress(requiredCredits: number = 140): number {
    return Math.min(100, Math.round((this._totalCredits / requiredCredits) * 100));
  }

  // --- Polymorphism: Implement abstract methods ---

  /**
   * Validates the student data and returns array of error messages.
   * Returns empty array if valid.
   */
  public validate(): string[] {
    const errors: string[] = [];

    if (!this._name || this._name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (!StudentModel.isValidEmail(this._email)) {
      errors.push('Invalid email format');
    }
    if (this._gpa < 0 || this._gpa > 4.0) {
      errors.push('GPA must be between 0 and 4.0');
    }
    if (this._totalCredits < 0) {
      errors.push('Total credits cannot be negative');
    }

    return errors;
  }

  /**
   * Serializes this student to a CSV row string.
   * DESIGN PATTERN: Template Method — concrete implementation
   */
  public toCsvRow(): string {
    const fields = [
      this.id,
      this._name,
      this._email,
      this._program,
      this._status,
      this._gpa.toString(),
      this._totalCredits.toString(),
      this._avatarUrl || '',
      this._grade || '',
      this._phone || '',
      this._dateOfBirth || '',
      this._address || '',
      this.createdAt,
      this.updatedAt
    ];
    return fields.map(f => `"${(f ?? '').replace(/"/g, '""')}"`).join(',');
  }

  /**
   * Static factory helper: Creates a StudentModel from a CSV row.
   */
  public static fromCsvRow(row: string[]): StudentModel {
    return new StudentModel(
      row[0] || '',
      row[1] || '',
      row[2] || '',
      (row[3] as Program) || 'Software Engineering',
      (row[4] as StudentStatus) || 'Pending',
      parseFloat(row[5]) || 0,
      parseInt(row[6]) || 0,
      row[7] || undefined,
      row[8] || undefined,
      row[9] || undefined,
      row[10] || undefined,
      row[11] || undefined,
      row[12] || undefined,
      row[13] || undefined
    );
  }

  /**
   * Returns CSV header for student data.
   */
  public static getCsvHeader(): string {
    return '"id","name","email","program","status","gpa","totalCredits","avatarUrl","grade","phone","dateOfBirth","address","createdAt","updatedAt"';
  }

  /**
   * Converts to a plain object (DTO) for React component consumption.
   */
  public toPlainObject() {
    return {
      id: this.id,
      name: this._name,
      email: this._email,
      program: this._program,
      status: this._status,
      avatarUrl: this._avatarUrl,
      gpa: this._gpa,
      totalCredits: this._totalCredits,
      grade: this._grade,
      phone: this._phone,
      dateOfBirth: this._dateOfBirth,
      address: this._address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // --- Static Utility Methods ---

  /**
   * Validates email format using regex.
   */
  public static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Returns all valid programs.
   */
  public static getAvailablePrograms(): Program[] {
    return ['Software Engineering', 'Marketing', 'Graphic Design', 'Data Science', 'Business Administration'];
  }
}
