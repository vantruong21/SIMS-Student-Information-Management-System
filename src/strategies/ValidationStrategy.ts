import { IValidator } from '../interfaces/IServices';
import { StudentModel } from '../models/Student';

/**
 * DESIGN PATTERN: Strategy Pattern
 * 
 * Different validation strategies that can be swapped at runtime.
 * Each strategy encapsulates a specific validation algorithm.
 * 
 * SOLID — Open/Closed: New validation strategies can be added without modifying existing ones.
 * SOLID — Single Responsibility: Each strategy validates one specific concern.
 */

// --- Strategy Interface is IValidator<T> from interfaces ---

/**
 * EmailValidationStrategy — Validates email format and domain rules.
 */
export class EmailValidationStrategy implements IValidator<string> {
  private allowedDomains: string[];

  constructor(allowedDomains: string[] = []) {
    this.allowedDomains = allowedDomains;
  }

  public validate(email: string): string[] {
    const errors: string[] = [];

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
      return errors;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    if (this.allowedDomains.length > 0) {
      const domain = email.split('@')[1]?.toLowerCase();
      if (domain && !this.allowedDomains.includes(domain)) {
        errors.push(`Email domain must be one of: ${this.allowedDomains.join(', ')}`);
      }
    }

    return errors;
  }
}

/**
 * PasswordValidationStrategy — Validates password strength.
 */
export class PasswordValidationStrategy implements IValidator<string> {
  private minLength: number;
  private requireUppercase: boolean;
  private requireNumber: boolean;
  private requireSpecialChar: boolean;

  constructor(
    minLength: number = 8,
    requireUppercase: boolean = true,
    requireNumber: boolean = true,
    requireSpecialChar: boolean = false
  ) {
    this.minLength = minLength;
    this.requireUppercase = requireUppercase;
    this.requireNumber = requireNumber;
    this.requireSpecialChar = requireSpecialChar;
  }

  public validate(password: string): string[] {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return errors;
    }

    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  }
}

/**
 * StudentDataValidationStrategy — Validates complete student registration data.
 */
export class StudentDataValidationStrategy implements IValidator<{
  name: string;
  email: string;
  program: string;
  phone?: string;
}> {
  private emailValidator: EmailValidationStrategy;

  constructor() {
    this.emailValidator = new EmailValidationStrategy();
  }

  public validate(data: { name: string; email: string; program: string; phone?: string }): string[] {
    const errors: string[] = [];

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Name must not exceed 100 characters');
    }

    // Email validation (delegates to email strategy)
    errors.push(...this.emailValidator.validate(data.email));

    // Program validation
    const validPrograms = StudentModel.getAvailablePrograms();
    if (!validPrograms.includes(data.program as any)) {
      errors.push(`Program must be one of: ${validPrograms.join(', ')}`);
    }

    // Phone validation (optional)
    if (data.phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(data.phone)) {
      errors.push('Invalid phone number format');
    }

    return errors;
  }
}

/**
 * CsvImportValidationStrategy — Validates CSV import data structure.
 */
export class CsvImportValidationStrategy implements IValidator<string> {
  private requiredColumns: number;

  constructor(requiredColumns: number = 2) {
    this.requiredColumns = requiredColumns;
  }

  public validate(csvContent: string): string[] {
    const errors: string[] = [];

    if (!csvContent || csvContent.trim().length === 0) {
      errors.push('CSV content is empty');
      return errors;
    }

    const lines = csvContent.split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      errors.push('CSV must contain at least a header and one data row');
    }

    // Check column count consistency
    const firstLineCols = lines[0].split(',').length;
    if (firstLineCols < this.requiredColumns) {
      errors.push(`CSV must have at least ${this.requiredColumns} columns`);
    }

    return errors;
  }
}

/**
 * ValidationContext — Uses Strategy pattern to switch validators dynamically.
 * 
 * DESIGN PATTERN: Strategy Pattern — context class
 */
export class ValidationContext<T> {
  private strategy: IValidator<T>;

  constructor(strategy: IValidator<T>) {
    this.strategy = strategy;
  }

  /**
   * Allows changing the validation strategy at runtime.
   */
  public setStrategy(strategy: IValidator<T>): void {
    this.strategy = strategy;
  }

  /**
   * Executes the current validation strategy.
   */
  public validate(data: T): string[] {
    return this.strategy.validate(data);
  }

  /**
   * Checks if the data is valid (no errors).
   */
  public isValid(data: T): boolean {
    return this.strategy.validate(data).length === 0;
  }
}
