import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginScreen } from '../../components/LoginScreen';
import { useAuthStore } from '../../store/useAuthStore';

// Mock Zustand store
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('LoginScreen Integration', () => {
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  it('renders login form elements with correct accessibility labels', () => {
    render(<LoginScreen />);
    
    // Check main accessible region
    expect(screen.getByRole('region', { name: /login form/i })).toBeInTheDocument();
    
    // Inputs accessible by labels
    expect(screen.getByRole('textbox', { name: /academic email address/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/secure password/i)).toBeInTheDocument(); // Password uses getByLabelText
    
    // Submit button
    expect(screen.getByRole('button', { name: /sign in to your account/i })).toBeInTheDocument();
  });

  it('shows error message when provided by store', () => {
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials provided.',
      clearError: mockClearError,
    });

    render(<LoginScreen />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials provided.');
  });

  it('allows user to toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);
    
    const passwordInput = screen.getByLabelText(/secure password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    await user.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls login function on form submit with correct parameters', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(true);
    
    render(<LoginScreen />);
    
    const emailInput = screen.getByRole('textbox', { name: /academic email address/i });
    const passwordInput = screen.getByLabelText(/secure password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in to your account/i });
    
    await user.type(emailInput, 'scholar@elevate.edu');
    await user.type(passwordInput, 'Student@123');
    
    // Triggers form submit
    await user.click(submitBtn);
    
    expect(mockClearError).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('scholar@elevate.edu', 'Student@123');
    });
  });
});
