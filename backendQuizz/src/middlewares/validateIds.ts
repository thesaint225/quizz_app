import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import z from 'zod';
import { QuizModel } from '../models/quizz';
import { Student } from '../models/studentsModel';

export const validateQuizId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId } = req.params;

  //   format Validation

  quizId: z.string().refine(
    (val) => {
      const isValid = mongoose.Types.ObjectId.isValid(val);
      if (!isValid) console.log(`Invalid Id format ${isValid}`);
      return isValid;
    },
    {
      message: 'Invalid Quiz id  format ',
    }
  );
};
