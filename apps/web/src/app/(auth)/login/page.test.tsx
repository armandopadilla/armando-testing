import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('renders login form with email and password fields', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('prevents submission with invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('prevents submission with empty password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn with credentials and redirects to /dashboard on success', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'user@example.com',
        password: 'password123',
        redirect: false,
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to callbackUrl query parameter on successful login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
    mockUseSearchParams.mockReturnValue({
      get: vi.fn((key) => key === 'callbackUrl' ? '/custom-page' : null),
    } as any);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/custom-page');
    });
  });

  it('displays error message on failed authentication', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' } as any);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('disables form inputs and button during submission', async () => {
    const user = userEvent.setup();
    mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ ok: true, error: null } as any), 100)));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check that elements are disabled during submission
    expect(emailInput.disabled).toBe(true);
    expect(passwordInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles unexpected errors gracefully', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValue(new Error('Network error'));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
