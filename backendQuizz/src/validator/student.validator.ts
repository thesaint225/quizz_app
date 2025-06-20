import { z } from 'zod';

// Zod schema validation
export const studentSchemaZod = z.object({
  studentId: z
    .string()
    .min(1, { message: 'Student ID is require' })
    .max(100, { message: 'Student ID is too long ' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

// // This is the TypeScript type for input validation
export type StudentInput = z.infer<typeof studentSchemaZod>;
