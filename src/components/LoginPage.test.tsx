import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('validates password minimum length', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');
    await user.click(submitButton);

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<LoginPage onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'securepassword123');
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'securepassword123',
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<LoginPage onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'securepassword123');
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});
