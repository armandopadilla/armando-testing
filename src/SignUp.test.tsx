import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const signUpSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
});

describe('SignUp validation', () => {
  it('should validate correct form data', () => {
    const validData = {
      firstname: 'John',
      email: 'john@example.com',
    };

    const result = signUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty firstname', () => {
    const invalidData = {
      firstname: '',
      email: 'john@example.com',
    };

    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      firstname: 'John',
      email: 'not-an-email',
    };

    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing fields', () => {
    const invalidData = {};

    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
