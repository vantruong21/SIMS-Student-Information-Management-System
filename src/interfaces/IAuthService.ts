import { UserRole } from '../models/User';

/**
 * IAuthService — Authentication Service Interface
 * 
 * SOLID — Interface Segregation (I): Only authentication concerns.
 * SOLID — Dependency Inversion (D): Components depend on this interface, not concrete auth.
 */
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string;
  };
  token?: string;
  error?: string;
}

export interface IAuthService {
  /** Authenticates a user with email and password. */
  login(email: string, password: string): Promise<AuthResult>;

  /** Logs out the current user. */
  logout(): void;

  /** Registers a new user account. */
  register(name: string, email: string, password: string, role: UserRole): Promise<AuthResult>;

  /** Hashes a plain-text password. */
  hashPassword(password: string): Promise<string>;

  /** Verifies a password against a stored hash. */
  verifyPassword(password: string, hash: string): Promise<boolean>;

  /** Checks if a user has the required role. */
  hasRole(userId: string, role: UserRole): boolean;

  /** Checks if the current session is still valid. */
  isSessionValid(): boolean;

  /** Validates password strength. Returns array of issues or empty if strong. */
  validatePasswordStrength(password: string): string[];
}
