import { z } from 'zod';
const questionZodSchema = z
  .object({
    quizId: z.string().min(1, { message: 'Quiz ID is required' }),
    // validate "text" field must  be non-empty string
    text: z.string().min(1, { message: 'Question text is required' }),
    // validate "options" must be an array with at least 2 string
    options: z
      .array(z.string())
      .min(2, { message: 'At least two options are required' }),
    correct: z.string().min(1, { message: 'Correct answer is required' }),
  })
  .refine((data) => data.options.includes(data.correct), {
    path: ['correct'],
    message: 'Correct answer must be one of the options',
  });
