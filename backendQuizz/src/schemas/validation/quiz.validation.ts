import { z } from 'zod';
 /**
  * Zod Validation Schema
  * validates input data when creating / updating quizzes
  */
  export const quizSchemaZod = z.object({
   title: z
     .string()
     .min(1, { message: 'Title is required' })
     .max(100, { message: 'Title cannot exceed 100 characters' }),
 
   quizCode: z
     .string()
     .min(3, { message: 'Quiz code must be at least 3 characters' })
     .max(20, { message: 'Quiz code cannot exceed 20 characters' }),
 
   duration: z
     .number()
     .min(1, { message: 'Duration must be at least 1 minute' })
     .max(300, { message: 'Duration cannot exceed 300 minutes' }),
 });