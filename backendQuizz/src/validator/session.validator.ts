import { z } from 'zod';

export const createSessionSchema = z
  .object({
    studentId: z
      .string() // must be a string
      .min(1, 'Student ID is required') // Ensures that the string is not empty
      .max(50, 'Student ID must be less than 50 characters') // prevents overly long IDs (security)
      .regex(/^[a-zA-Z0-9_-]+$/, 'Student ID contains invalid characters'), // Whitelist allowed chars

    quizId: z
      .string() // must be a string
      .min(1, 'Quiz ID is required') // Ensures that string is not empty
      .max(50, 'Quiz ID must be less than 50 characters') // prevents overly long IDs (security)
      .regex(/^[a-zA-Z0-9_-]+$/, 'Quiz ID contains invalid characters'), // Whitelist allowed chars

    status: z.enum(['in-progress', 'completed']).default('in-progress'), // Default value if not provided
  })
  .strict(); // Note: strict() is a function call - needs parentheses

// Derived TypeScript type for static type checking
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
