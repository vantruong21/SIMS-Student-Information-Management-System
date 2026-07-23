import { describe, it, expect, beforeEach } from 'vitest';
import { StudentModel } from '../../models/Student';

describe('StudentModel', () => {
  let student: StudentModel;

  beforeEach(() => {
    student = new StudentModel(
      'STD-001',
      'Test User',
      'test@elevate.edu',
      'Software Engineering',
      'Pending',
      0,
      0
    );
  });

  it('should initialize with correct default values', () => {
    expect(student.id).toBe('STD-001');
    expect(student.name).toBe('Test User');
    expect(student.email).toBe('test@elevate.edu');
    expect(student.program).toBe('Software Engineering');
    expect(student.status).toBe('Pending');
    expect(student.gpa).toBe(0);
    expect(student.totalCredits).toBe(0);
  });

  it('should validate correctly', () => {
    const errors = student.validate();
    expect(errors).toHaveLength(0);
  });

  it('should catch invalid email', () => {
    student.email = 'invalid-email';
    const errors = student.validate();
    expect(errors).toContain('Invalid email format');
  });

  it('should catch negative GPA', () => {
    student.gpa = -1;
    const errors = student.validate();
    expect(errors).toContain('GPA must be between 0 and 4.0');
  });

  it('should approve student status', () => {
    expect(student.status).toBe('Pending');
    student.approve();
    expect(student.status).toBe('Active');
  });

  it('should not allow approving active student', () => {
    student.approve();
    expect(() => student.approve()).toThrow('Cannot approve student with status: Active');
  });

  it('should calculate graduation progress correctly', () => {
    student.totalCredits = 70;
    expect(student.getGraduationProgress(140)).toBe(50);
    
    student.totalCredits = 150;
    expect(student.getGraduationProgress(140)).toBe(100);
  });

  it('should serialize to CSV correctly', () => {
    const csv = student.toCsvRow();
    expect(csv).toContain('"STD-001"');
    expect(csv).toContain('"Test User"');
    expect(csv).toContain('"test@elevate.edu"');
  });

  it('should deserialize from CSV correctly', () => {
    const row = ['STD-002', 'Alice', 'alice@elevate.edu', 'Marketing', 'Active', '3.8', '60'];
    const newStudent = StudentModel.fromCsvRow(row);
    expect(newStudent.id).toBe('STD-002');
    expect(newStudent.name).toBe('Alice');
    expect(newStudent.program).toBe('Marketing');
    expect(newStudent.gpa).toBe(3.8);
    expect(newStudent.totalCredits).toBe(60);
  });
});
