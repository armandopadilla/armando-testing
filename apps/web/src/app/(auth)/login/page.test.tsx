import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoginPage from './page'

describe('LoginPage', () => {
  it('renders the company heading', () => {
    render(<LoginPage />)
    expect(screen.getByText('Acme Title Company')).toBeInTheDocument()
  })

  it('renders email and password fields with correct labels and placeholders', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('placeholder', 'example@example.com')
    
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).not.toHaveAttribute('placeholder')
  })

  it('renders Continue button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('displays error message and red border when email is empty on submit', () => {
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const submitButton = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Field can not be empty')).toBeInTheDocument()
    
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveClass('border-red-500')
  })

  it('displays error message and red border when password is empty on submit', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    const submitButton = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Field can not be empty')).toBeInTheDocument()
    
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveClass('border-red-500')
  })

  it('displays errors for both fields when both are empty on submit', () => {
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(submitButton)
    
    const errorMessages = screen.getAllByText('Field can not be empty')
    expect(errorMessages).toHaveLength(2)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    expect(emailInput).toHaveClass('border-red-500')
    expect(passwordInput).toHaveClass('border-red-500')
  })

  it('clears email error when user starts typing in email field', () => {
    render(<LoginPage />)
    
    // Submit with empty fields to trigger errors
    const submitButton = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(submitButton)
    
    // Verify email error is shown
    expect(screen.getAllByText('Field can not be empty')).toHaveLength(2)
    
    // Start typing in email field
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 't' } })
    
    // Email error should be cleared, but password error should remain
    const remainingErrors = screen.getAllByText('Field can not be empty')
    expect(remainingErrors).toHaveLength(1)
    
    // Email input should no longer have red border
    expect(emailInput).not.toHaveClass('border-red-500')
  })

  it('clears password error when user starts typing in password field', () => {
    render(<LoginPage />)
    
    // Submit with empty fields to trigger errors
    const submitButton = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(submitButton)
    
    // Verify both errors are shown
    expect(screen.getAllByText('Field can not be empty')).toHaveLength(2)
    
    // Start typing in password field
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'p' } })
    
    // Password error should be cleared, but email error should remain
    const remainingErrors = screen.getAllByText('Field can not be empty')
    expect(remainingErrors).toHaveLength(1)
    
    // Password input should no longer have red border
    expect(passwordInput).not.toHaveClass('border-red-500')
  })

  it('does not display errors when both fields are filled', () => {
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const submitButton = screen.getByRole('button', { name: 'Continue' })
    fireEvent.click(submitButton)
    
    expect(screen.queryByText('Field can not be empty')).not.toBeInTheDocument()
    expect(emailInput).not.toHaveClass('border-red-500')
    expect(passwordInput).not.toHaveClass('border-red-500')
  })
})
