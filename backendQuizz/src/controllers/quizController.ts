import { Request, Response, NextFunction } from 'express';
import { QuizModels } from '../models/quizz';
import { quizSchemaZod } from '../schemas/validation/quiz.validation';
import { QuizInput, QuizOutput } from '../schemas/types/quiz.type';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @description   createQuiz
//@route         POST/api/v1/quizzes
// @access        public
export const createQuiz = asyncHandler(
  async (
    req: Request<{}, {}, QuizInput>,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    // 1.validate input with zod
    const parseResult = quizSchemaZod.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    // let destructure the parseResult.data and renaming to something more descriptive
    const validatedData = parseResult.data;
    const { title, quizCode, duration } = validatedData;

    // 2.check for  duplicate quiz code

    const existingQuiz = await QuizModels.findOne({ quizCode });
    if (existingQuiz) {
      res.status(409).json({
        success: false,
        message: `quiz code ${quizCode} already exists`,
      });
      return;
    }

    // 3.create new Quiz
    const createQuiz = await QuizModels.create({
      title,
      quizCode,
      duration,
      questions: [],
    });

    // .format response using QuizOutput type
    const QuizOutput: QuizOutput = {
      _id: (createQuiz._id as mongoose.Types.ObjectId).toString(),
      title: createQuiz.title,
      quizCode: createQuiz.quizCode,
      duration: createQuiz.duration,
      questionCount: createQuiz.questions?.length || 0,
      createdAt: createQuiz.createAt,
      updatedAt: createQuiz.updatedAt,
    };

    // send  response with selected fields

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: QuizOutput,
    });
  }
);

// @description  getAllQuizzes
// @route        GET/api/v1/quizzes
// @access       public

export const getAllQuiz = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const allQuiz = await QuizModels.find();

    // Add a fallback when allQuiz is empty

    if (!allQuiz || allQuiz.length === 0) {
      res.status(200).json({
        success: true,
        message: 'no quiz found ',
        data: [],
      });
    }

    // Convert each quiz document from the database into a clean, structured object
    // that only includes the fields defined in the QuizOutput type.
    // This helps control what data gets sent back to the frontend.

    const quizOutputList: QuizOutput[] = allQuiz.map((quiz) => {
      if (quiz.createAt || quiz.updated)
        throw new Error("'Missing timestamp on a question document'");
      return {
        _id: (quiz._id as mongoose.Types.ObjectId).toString(),
        title: quiz.title,
        quizCode: quiz.quizCode,
        duration: quiz.duration,
        questionCount: quiz.questions?.length || 0,
        createdAt: quiz.createAt,
        updatedAt: quiz.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      count: quizOutputList.length,
      data: quizOutputList,
    });
  }
);
