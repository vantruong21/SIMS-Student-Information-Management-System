import { BaseEntity } from './BaseEntity';

/**
 * GradeModel — Domain Model for student grades
 * 
 * OOP: Inheritance, Encapsulation with calculated properties
 */
export class GradeModel extends BaseEntity {
  private _studentId: string;
  private _courseId: string;
  private _assignment: number;
  private _midterm: number;
  private _final: number;
  private _remarks: string;

  constructor(
    id: string,
    studentId: string,
    courseId: string,
    assignment: number = 0,
    midterm: number = 0,
    finalScore: number = 0,
    remarks: string = '',
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this._studentId = studentId;
    this._courseId = courseId;
    this._assignment = assignment;
    this._midterm = midterm;
    this._final = finalScore;
    this._remarks = remarks;
  }

  get studentId(): string { return this._studentId; }
  get courseId(): string { return this._courseId; }
  get assignment(): number { return this._assignment; }
  get midterm(): number { return this._midterm; }
  get finalScore(): number { return this._final; }
  get remarks(): string { return this._remarks; }

  set assignment(value: number) {
    if (value < 0 || value > 100) throw new Error('Assignment score must be 0-100');
    this._assignment = value;
    this.touch();
  }

  set midterm(value: number) {
    if (value < 0 || value > 100) throw new Error('Midterm score must be 0-100');
    this._midterm = value;
    this.touch();
  }

  set finalScore(value: number) {
    if (value < 0 || value > 100) throw new Error('Final score must be 0-100');
    this._final = value;
    this.touch();
  }

  set remarks(value: string) {
    this._remarks = value;
    this.touch();
  }

  /**
   * Calculates weighted average: Assignment 30%, Midterm 30%, Final 40%
   */
  public getWeightedAverage(): number {
    return Math.round((this._assignment * 0.3 + this._midterm * 0.3 + this._final * 0.4) * 100) / 100;
  }

  /**
   * Returns letter grade based on weighted average.
   */
  public getLetterGrade(): string {
    const avg = this.getWeightedAverage();
    if (avg >= 90) return 'A';
    if (avg >= 85) return 'A-';
    if (avg >= 80) return 'B+';
    if (avg >= 75) return 'B';
    if (avg >= 70) return 'B-';
    if (avg >= 65) return 'C+';
    if (avg >= 60) return 'C';
    if (avg >= 55) return 'D+';
    if (avg >= 50) return 'D';
    return 'F';
  }

  /**
   * Returns GPA points for this course grade.
   */
  public getGpaPoints(): number {
    const letter = this.getLetterGrade();
    const map: Record<string, number> = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D+': 1.3, 'D': 1.0, 'F': 0 };
    return map[letter] ?? 0;
  }

  public validate(): string[] {
    const errors: string[] = [];
    if (!this._studentId) errors.push('Student ID is required');
    if (!this._courseId) errors.push('Course ID is required');
    if (this._assignment < 0 || this._assignment > 100) errors.push('Assignment score must be 0-100');
    if (this._midterm < 0 || this._midterm > 100) errors.push('Midterm score must be 0-100');
    if (this._final < 0 || this._final > 100) errors.push('Final score must be 0-100');
    return errors;
  }

  public toCsvRow(): string {
    const fields = [this.id, this._studentId, this._courseId, this._assignment.toString(), this._midterm.toString(), this._final.toString(), this._remarks, this.createdAt, this.updatedAt];
    return fields.map(f => `"${(f ?? '').replace(/"/g, '""')}"`).join(',');
  }

  public static fromCsvRow(row: string[]): GradeModel {
    return new GradeModel(row[0], row[1], row[2], parseFloat(row[3]) || 0, parseFloat(row[4]) || 0, parseFloat(row[5]) || 0, row[6] || '', row[7], row[8]);
  }

  public static getCsvHeader(): string {
    return '"id","studentId","courseId","assignment","midterm","final","remarks","createdAt","updatedAt"';
  }

  public toPlainObject() {
    return {
      id: this.id, studentId: this._studentId, courseId: this._courseId,
      assignment: this._assignment, midterm: this._midterm, final: this._final,
      grade: this.getLetterGrade(), score: this.getWeightedAverage(), remarks: this._remarks,
      updatedAt: this.updatedAt
    };
  }
}
