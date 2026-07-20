import { BaseEntity } from './BaseEntity';

export class DepartmentModel extends BaseEntity {
  private _name: string;
  private _head: string;
  private _description: string;
  private _facultyCount: number;

  constructor(
    id: string,
    name: string,
    head: string,
    description: string,
    facultyCount: number = 0,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    this._head = head;
    this._description = description;
    this._facultyCount = facultyCount;
  }

  // --- Getters ---
  get name(): string { return this._name; }
  get head(): string { return this._head; }
  get description(): string { return this._description; }
  get facultyCount(): number { return this._facultyCount; }

  // --- Setters ---
  set name(value: string) {
    this._name = value;
    this.touch();
  }
  set head(value: string) {
    this._head = value;
    this.touch();
  }
  set description(value: string) {
    this._description = value;
    this.touch();
  }
  set facultyCount(value: number) {
    this._facultyCount = value;
    this.touch();
  }

  public toCsvRow(): string {
    return `"${this.id}","${this._name}","${this._head}","${this._description}",${this._facultyCount},"${this.createdAt}","${this.updatedAt}"`;
  }

  public static fromCsvRow(row: string[]): DepartmentModel {
    return new DepartmentModel(
      row[0] || '',
      row[1] || '',
      row[2] || '',
      row[3] || '',
      parseInt(row[4]) || 0,
      row[5] || undefined,
      row[6] || undefined
    );
  }

  public static getCsvHeader(): string {
    return '"id","name","head","description","facultyCount","createdAt","updatedAt"';
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this._name,
      head: this._head,
      description: this._description,
      facultyCount: this._facultyCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
