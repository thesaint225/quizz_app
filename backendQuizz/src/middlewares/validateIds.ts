import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { quizIdSchema } from '../schemas/quiz.schema';
import { QuizModels } from '../models/quizz';

interface CustomRequest extends Request {
  quiz?: mongoose.Document; //Attach quiz to request
}

export const validateQuizId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { quizId } = req.params;

  try {
    //1.  Validate ID format with zod
    const formatValidation = quizIdSchema.safeParse(quizId);
    if (!formatValidation.success) {
      return res.status(400).json({
        error: `validation failed`,
        details: formatValidation.error.flatten(),
      });
    }

    // 2.Check if quiz exists in database
    const quiz = await QuizModels.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        error: `Quiz with ID ${quizId} not found`,
      });
    }

    // 3.Attach quiz to request  for downstream middleware/controllers
    req.quiz = quiz;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(`[ValidateQuizId] error: ${error.message}`);
      res.status(500).json({
        error: 'Internal server error during validation',
        systemMessage:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    } else {
      console.log('[ValidateQuizId] Unexpected error', error);
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
