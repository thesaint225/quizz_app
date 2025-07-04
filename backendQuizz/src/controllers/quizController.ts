import { Request, Response, NextFunction } from 'express';
import { Quiz } from '../models/quizz';
import { quizSchemaZod } from '../schemas/validation/quiz.validation';
import { QuizInput } from '../schemas/types/quiz.type';
import asyncHandler from 'express-async-handler';

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

    const existingQuiz = await Quiz.findOne({ quizCode });
    if (existingQuiz) {
      res.status(409).json({
        success: false,
        message: `quiz code ${quizCode} already exists`,
      });
      return;
    }

    // 3.create new Quiz
    const newQuiz = await Quiz.create({
      title,
      quizCode,
      duration,
      questions: [],
    });

    // send  response with selected fields

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: {
        id: newQuiz._id,
        title: newQuiz.title,
        quizCode: newQuiz.quizCode,
        duration: newQuiz.duration,
        questionCount: newQuiz.questions?.length || 0,
        createdAt: newQuiz.createdAt,
      },
    });
  }
);

// @description  getAllQuizzes
// @route        GET/api/v1/quizzes
// @access       public

export const getAllQuiz = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const allQuiz = await Quiz.find();

    // Add a fallback when allQuiz is empty

    if (!allQuiz || allQuiz.length === 0) {
      res.status(200).json({
        success: true,
        message: 'no quiz found ',
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: allQuiz.length,
      data: allQuiz,
    });
  }
);
