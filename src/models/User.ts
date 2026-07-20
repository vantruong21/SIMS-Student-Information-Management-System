import { BaseEntity } from './BaseEntity';

/**
 * UserModel — Domain Model for system users (authentication & authorization)
 * 
 * OOP: Inheritance from BaseEntity, Encapsulation of sensitive data (password hash)
 * SOLID — Single Responsibility: Only handles user identity and role management.
 */
export type UserRole = 'Student' | 'Faculty' | 'Admin';

export class UserModel extends BaseEntity {
  private _name: string;
  private _email: string;
  private _role: UserRole;
  private _passwordHash: string;
  private _avatarUrl: string;
  private _isActive: boolean;
  private _lastLoginAt?: string;
  private _failedLoginAttempts: number;
  private _lockedUntil?: string;
  private _isLocked: boolean;
  private _phone?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    role: UserRole,
    passwordHash: string,
    avatarUrl: string = '',
    isActive: boolean = true,
    lastLoginAt?: string,
    failedLoginAttempts: number = 0,
    lockedUntil?: string,
    isLocked: boolean = false,
    phone?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    this._email = email.trim().toLowerCase();
    this._role = role;
    this._passwordHash = passwordHash;
    this._avatarUrl = avatarUrl;
    this._isActive = isActive;
    this._lastLoginAt = lastLoginAt;
    this._failedLoginAttempts = failedLoginAttempts;
    this._lockedUntil = lockedUntil;
    this._isLocked = isLocked;
    this._phone = phone;
  }

  // --- Getters ---
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get role(): UserRole { return this._role; }
  get passwordHash(): string { return this._passwordHash; }
  get avatarUrl(): string { return this._avatarUrl; }
  get isActive(): boolean { return this._isActive; }
  get lastLoginAt(): string | undefined { return this._lastLoginAt; }
  public get failedLoginAttempts() { return this._failedLoginAttempts; }
  public get lockedUntil() { return this._lockedUntil; }
  public get isLocked() { return this._isLocked; }
  public get phone() { return this._phone; }

  // --- Setters ---
  set name(value: string) {
    if (!value.trim()) throw new Error('User name cannot be empty');
    this._name = value.trim();
    this.touch();
  }

  set avatarUrl(value: string) {
    this._avatarUrl = value;
    this.touch();
  }

  set passwordHash(value: string) {
    this._passwordHash = value;
    this.touch();
  }

  // --- Business Methods ---

  /**
   * Checks if user has a specific role.
   */
  public hasRole(role: UserRole): boolean {
    return this._role === role;
  }

  /**
   * Checks if user is authorized to access a feature.
   * SOLID — Open/Closed: Can extend role hierarchy without modifying this.
   */
  public canAccess(requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(this._role);
  }

  /**
   * Records a successful login.
   */
  public recordLogin(): void {
    this._lastLoginAt = new Date().toISOString();
    this.resetLoginAttempts();
  }

  public resetLoginAttempts() {
    this._failedLoginAttempts = 0;
    this._lockedUntil = undefined;
    this.touch();
  }

  public toggleLock() {
    this._isLocked = !this._isLocked;
    this.touch();
  }

  public updatePhone(phone: string) {
    this._phone = phone;
    this.touch();
  }

  /**
   * Records a failed login attempt. Locks after 5 failures.
   */
  public recordFailedLogin(): void {
    this._failedLoginAttempts += 1;
    if (this._failedLoginAttempts >= 5) {
      const lockTime = new Date();
      lockTime.setMinutes(lockTime.getMinutes() + 5);
      this._lockedUntil = lockTime.toISOString();
    }
    this.touch();
  }

  /**
   * Checks if the account is currently locked.
   */
  public isLocked(): boolean {
    if (!this._lockedUntil) return false;
    return new Date() < new Date(this._lockedUntil);
  }

  /**
   * Deactivates the user account.
   */
  public deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  /**
   * Activates the user account.
   */
  public activate(): void {
    this._isActive = true;
    this.touch();
  }

  // --- Polymorphism: Implement abstract methods ---

  public validate(): string[] {
    const errors: string[] = [];
    if (!this._name || this._name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!this._email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) errors.push('Invalid email format');
    if (!this._passwordHash) errors.push('Password hash is required');
    if (!['Student', 'Faculty', 'Admin'].includes(this._role)) errors.push('Invalid role');
    return errors;
  }

  public toCsvRow(): string {
    const fields = [
      this.id,
      this._name,
      this._email,
      this._role,
      this._passwordHash,
      this._avatarUrl,
      this._isActive ? 'true' : 'false',
      this._lastLoginAt || '',
      this._failedLoginAttempts.toString(),
      this._lockedUntil || '',
      this.createdAt,
      this.updatedAt
    ];
    return fields.map(f => `"${(f ?? '').replace(/"/g, '""')}"`).join(',');
  }

  public static fromCsvRow(row: string[]): UserModel {
    return new UserModel(
      row[0] || '',
      row[1] || '',
      row[2] || '',
      (row[3] as UserRole) || 'Student',
      row[4] || '',
      row[5] || '',
      row[6] !== 'false',
      row[7] || undefined,
      parseInt(row[8]) || 0,
      row[9] || undefined,
      row[10] === 'true',
      row[11] || undefined,
      row[12] || undefined,
      row[13] || undefined
    );
  }

  public static getCsvHeader(): string {
    return '"id","name","email","role","passwordHash","avatarUrl","isActive","lastLoginAt","failedLoginAttempts","lockedUntil","isLocked","phone","createdAt","updatedAt"';
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this._name,
      email: this._email,
      role: this._role,
      avatarUrl: this._avatarUrl,
      isActive: this._isActive,
      lastLoginAt: this._lastLoginAt,
      isLocked: this._isLocked,
      phone: this._phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public toProfile() {
    return {
      id: this.id,
      name: this._name,
      role: this._role,
      email: this._email,
      avatarUrl: this._avatarUrl,
      phone: this._phone
    };
  }
}
