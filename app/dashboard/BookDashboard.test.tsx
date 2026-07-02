import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

// Simple runtime validation tests for the Book schema
const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  category: z.enum(['Sci-Fi', 'Romance', 'Adventure', 'Mystery']),
  year: z.number(),
  pages: z.number(),
});

describe('BookDashboard', () => {
  it('should validate valid book data', () => {
    const validBook = {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Sci-Fi' as const,
      year: 2020,
      pages: 300,
    };

    expect(() => BookSchema.parse(validBook)).not.toThrow();
  });

  it('should reject invalid category', () => {
    const invalidBook = {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Invalid',
      year: 2020,
      pages: 300,
    };

    expect(() => BookSchema.parse(invalidBook)).toThrow();
  });

  it('should reject missing required fields', () => {
    const invalidBook = {
      id: '1',
      title: 'Test Book',
    };

    expect(() => BookSchema.parse(invalidBook)).toThrow();
  });
});
