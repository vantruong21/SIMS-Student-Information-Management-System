import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppFacade } from '../../facades/AppFacade';
import { UserModel } from '../../models/User';

describe('AuthService (via AppFacade)', () => {
  let facade: AppFacade;

  beforeEach(() => {
    AppFacade.resetInstance();
    facade = AppFacade.getInstance();
    
    // Clear localStorage
    localStorage.clear();
  });

  it('should hash password correctly', async () => {
    const hash1 = await facade.hashPassword('password123');
    const hash2 = await facade.hashPassword('password123');
    const hash3 = await facade.hashPassword('different');
    
    expect(hash1).toBeDefined();
    expect(hash1).toHaveLength(64); // SHA-256 is 256 bits = 64 hex chars
    expect(hash1).toBe(hash2); // Same input = same output
    expect(hash1).not.toBe(hash3); // Different input = different output
  });

  it('should reject login for non-existent user', async () => {
    const result = await facade.login('nobody@elevate.edu', 'pass');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
  });

  it('should enforce account lockout after 5 failed attempts', async () => {
    // Seed initial user
    await facade.seedInitialData();
    
    // Get existing user hash by hashing the password we know is used in seed
    // We try to login with wrong password 5 times
    const email = 'scholar@elevate.edu'; // From seed data
    const wrongPass = 'wrong';

    let result = await facade.login(email, wrongPass);
    expect(result.success).toBe(false);
    expect(result.error).toContain('4 attempts remaining');

    await facade.login(email, wrongPass);
    await facade.login(email, wrongPass);
    await facade.login(email, wrongPass);
    
    result = await facade.login(email, wrongPass);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Account locked');

    // Attempt 6 should immediately fail because of lockout
    result = await facade.login(email, wrongPass);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Account is temporarily locked');
  });

  it('should validate password strength', () => {
    const weak = facade.validatePassword('weak');
    expect(weak.length).toBeGreaterThan(0);
    
    const strong = facade.validatePassword('StrongPass123!');
    // If our strategy requires 8 chars, 1 upper, 1 number - this should pass
    expect(strong.length).toBe(0);
  });
});
