import { z } from 'zod';
import { quizSchemaZod } from '../validation/quiz.validation';

export type QuizInput = z.infer<typeof quizSchemaZod>;
export type QuizOutput = Omit<QuizInput, 'questions'> & {
  _id: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
};
