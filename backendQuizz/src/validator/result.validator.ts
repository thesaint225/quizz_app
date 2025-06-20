import { z } from 'zod';
import mongoose, { Mongoose } from 'mongoose';

export const resultSchemaZod = z.object({
  studentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Student ID format',
  }),
  quizId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Quiz ID format ',
  }),
  score: z.number().min(0).max(100),
  correctAnswer: z.number().min(0),
  totalQuestion: z.number().min(1),
  SubmittedAt: z.date().optional().default(new Date()),
});

export type ResultInput = z.infer<typeof resultSchemaZod>;
