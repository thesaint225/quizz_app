import z from 'zod';
import mongoose from 'mongoose';

export const resultSchemaZod = z.object({
  studentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Student Id format  ',
  }),

  // Quiz ID validation

  quizId: z.string().refine(
    (val) => {
      const isValid = mongoose.Types.ObjectId.isValid(val);
      if (!val) console.log(`Invalid format  ID:${val} `);
      return isValid;
    },
    {
      message: 'Invalid Id Quiz Id format ',
    }
  ),
  totalQuestions: z.number().min(1),
  score: z.number().min(0),
  percentage: z.number().min(0).max(100).optional(),
});

export type ResultInput = z.infer<typeof resultSchemaZod>;
