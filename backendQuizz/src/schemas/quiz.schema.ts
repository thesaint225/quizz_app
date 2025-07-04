import { z } from 'zod';
import mongoose from 'mongoose';

export const quizIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Quiz ID format- must be a 24-character hex string',
  });
