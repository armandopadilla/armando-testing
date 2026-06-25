import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from './page';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('LoginPage', () => {
  const mockPush = vi.fn();
  const mockSignIn = vi.mocked(signIn);
  const mockUseRouter = vi.mocked(useRouter);
  const mockUseSearchParams = vi.mocked(useSearchParams);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
    mockUseSearchParams.mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);
  });

  it('renders email and password fields', () => {
    render(<LoginPage />);
    
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays validation error for invalid email', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('displays validation error for empty password', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your password')).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn with correct credentials on form submission', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('redirects to /dashboard on successful login', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to callbackUrl when provided', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
    mockUseSearchParams.mockReturnValue({
      get: vi.fn().mockReturnValue('/custom-path'),
    } as any);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/custom-path');
    });
  });

  it('displays error message on failed login', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' } as any);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading state during authentication', async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });

    // Fields should be disabled during loading
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('clears error message on new submission', async () => {
    mockSignIn.mockResolvedValueOnce({ ok: false, error: 'CredentialsSignin' } as any);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // First submission with error
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    // Second submission should clear error
    mockSignIn.mockResolvedValueOnce({ ok: true, error: null } as any);
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });
  });

  it('handles unexpected errors gracefully', async () => {
    mockSignIn.mockRejectedValue(new Error('Network error'));

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
