import { BaseEntity } from './BaseEntity';

/**
 * CourseModel — Domain Model Class
 * 
 * OOP PRINCIPLES:
 * - Inheritance: Extends BaseEntity
 * - Encapsulation: Private fields with controlled access
 * - Polymorphism: Implements abstract methods from BaseEntity
 * 
 * SOLID — Single Responsibility: Only manages course data and course-specific logic.
 */
export type CourseStatus = 'In Progress' | 'Midterms' | 'Completed' | 'Upcoming';

export class CourseModel extends BaseEntity {
  private _code: string;
  private _name: string;
  private _instructor: string;
  private _schedule: string;
  private _status: CourseStatus;
  private _credits: number;
  private _capacity: number;
  private _gpaContribution: number;
  private _description: string;
  private _department: string;

  constructor(
    id: string,
    code: string,
    name: string,
    instructor: string,
    schedule: string,
    status: CourseStatus = 'Upcoming',
    credits: number = 3,
    capacity: number = 35,
    gpaContribution: number = 0,
    description: string = '',
    department: string = '',
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this._code = code;
    this._name = name;
    this._instructor = instructor;
    this._schedule = schedule;
    this._status = status;
    this._credits = credits;
    this._capacity = capacity;
    this._gpaContribution = gpaContribution;
    this._description = description;
    this._department = department;
  }

  // --- Encapsulation: Getters ---
  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get instructor(): string { return this._instructor; }
  get schedule(): string { return this._schedule; }
  get status(): CourseStatus { return this._status; }
  get credits(): number { return this._credits; }
  get capacity(): number { return this._capacity; }
  get gpaContribution(): number { return this._gpaContribution; }
  get description(): string { return this._description; }
  get department(): string { return this._department; }

  // --- Encapsulation: Setters with validation ---
  set code(value: string) {
    if (!value || value.trim().length === 0) throw new Error('Course code cannot be empty');
    this._code = value.trim().toUpperCase();
    this.touch();
  }

  set name(value: string) {
    if (!value || value.trim().length === 0) throw new Error('Course name cannot be empty');
    this._name = value.trim();
    this.touch();
  }

  set instructor(value: string) {
    this._instructor = value.trim();
    this.touch();
  }

  set schedule(value: string) {
    this._schedule = value;
    this.touch();
  }

  set status(value: CourseStatus) {
    this._status = value;
    this.touch();
  }

  set credits(value: number) {
    if (value < 1 || value > 6) throw new Error('Credits must be between 1 and 6');
    this._credits = value;
    this.touch();
  }

  set capacity(value: number) {
    if (value < 1) throw new Error('Capacity must be at least 1');
    this._capacity = value;
    this.touch();
  }

  set description(value: string) {
    this._description = value;
    this.touch();
  }

  set department(value: string) {
    this._department = value;
    this.touch();
  }

  // --- Business Methods ---

  /**
   * Checks if the course has available seats for enrollment.
   */
  public hasCapacity(currentEnrolled: number): boolean {
    return currentEnrolled < this._capacity;
  }

  /**
   * Returns the number of available seats.
   */
  public getAvailableSeats(currentEnrolled: number): number {
    return Math.max(0, this._capacity - currentEnrolled);
  }

  /**
   * Returns occupancy percentage.
   */
  public getOccupancyRate(currentEnrolled: number): number {
    return Math.round((currentEnrolled / this._capacity) * 100);
  }

  /**
   * Marks course as completed.
   */
  public complete(): void {
    this._status = 'Completed';
    this.touch();
  }

  // --- Polymorphism: Implement abstract methods ---

  public validate(): string[] {
    const errors: string[] = [];

    if (!this._code || this._code.trim().length < 2) {
      errors.push('Course code must be at least 2 characters');
    }
    if (!this._name || this._name.trim().length < 3) {
      errors.push('Course name must be at least 3 characters');
    }
    if (this._credits < 1 || this._credits > 6) {
      errors.push('Credits must be between 1 and 6');
    }
    if (this._capacity < 1) {
      errors.push('Capacity must be at least 1');
    }

    return errors;
  }

  public toCsvRow(): string {
    const fields = [
      this.id,
      this._code,
      this._name,
      this._instructor,
      this._schedule,
      this._status,
      this._credits.toString(),
      this._capacity.toString(),
      this._gpaContribution.toString(),
      this._description,
      this._department,
      this.createdAt,
      this.updatedAt
    ];
    return fields.map(f => `"${(f ?? '').replace(/"/g, '""')}"`).join(',');
  }

  public static fromCsvRow(row: string[]): CourseModel {
    return new CourseModel(
      row[0] || '',
      row[1] || '',
      row[2] || '',
      row[3] || '',
      row[4] || '',
      (row[5] as CourseStatus) || 'Upcoming',
      parseInt(row[6]) || 3,
      parseInt(row[7]) || 35,
      parseFloat(row[8]) || 0,
      row[9] || '',
      row[10] || '',
      row[11] || undefined,
      row[12] || undefined
    );
  }

  public static getCsvHeader(): string {
    return '"id","code","name","instructor","schedule","status","credits","capacity","gpaContribution","description","department","createdAt","updatedAt"';
  }

  public toPlainObject() {
    return {
      id: this.id,
      code: this._code,
      name: this._name,
      instructor: this._instructor,
      schedule: this._schedule,
      status: this._status,
      credits: this._credits,
      capacity: this._capacity,
      gpaContribution: this._gpaContribution,
      description: this._description,
      department: this._department,
      assignedCount: 0,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
