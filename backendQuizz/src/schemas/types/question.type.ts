import { z } from 'zod';
import { questionZodSchema } from '../validation/question.validation';

// Types for input(e.g,req.body)

export type QuestionInput = z.infer<typeof questionZodSchema>;

// Type  for output (e.g,Api response )

export type QuestionOutput = Omit<QuestionInput, 'quizId'> & {
  _id: string;
  quizRef: string;
  createdAt: Date;
  updatedAt: Date;
};
