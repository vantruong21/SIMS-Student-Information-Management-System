import { BaseEntity } from './BaseEntity';

/**
 * EnrollmentModel — Association Entity linking Students to Courses
 * 
 * OOP: Inheritance from BaseEntity
 * Represents the many-to-many relationship between Students and Courses.
 */
export class EnrollmentModel extends BaseEntity {
  private _studentId: string;
  private _courseId: string;
  private _enrolledAt: string;

  constructor(
    id: string,
    studentId: string,
    courseId: string,
    enrolledAt?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this._studentId = studentId;
    this._courseId = courseId;
    this._enrolledAt = enrolledAt || new Date().toISOString();
  }

  get studentId(): string { return this._studentId; }
  get courseId(): string { return this._courseId; }
  get enrolledAt(): string { return this._enrolledAt; }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this._studentId) errors.push('Student ID is required');
    if (!this._courseId) errors.push('Course ID is required');
    return errors;
  }

  public toCsvRow(): string {
    const fields = [this.id, this._studentId, this._courseId, this._enrolledAt, this.createdAt, this.updatedAt];
    return fields.map(f => `"${(f ?? '').replace(/"/g, '""')}"`).join(',');
  }

  public static fromCsvRow(row: string[]): EnrollmentModel {
    return new EnrollmentModel(row[0], row[1], row[2], row[3], row[4], row[5]);
  }

  public static getCsvHeader(): string {
    return '"id","studentId","courseId","enrolledAt","createdAt","updatedAt"';
  }

  public toPlainObject() {
    return { id: this.id, studentId: this._studentId, courseId: this._courseId, enrolledAt: this._enrolledAt };
  }
}
