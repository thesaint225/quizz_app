import { Request, Response, NextFunction } from "express";
import { QuizModel, quizSchemaZod } from "../models/quizz";
import asyncHandler from "express-async-handler";

// @description   createQuiz
//@route         POST/api/v1/quizzes
// @access        public
export const createQuiz = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const parseResult = quizSchemaZod.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    // let destructure the parseResult.data and renaming to something more descriptive

    const { data: validatedQuizData } = parseResult;

    // if validation is successful create quiz

    const quiz = await QuizModel.create(validatedQuizData);
    res.status(201).json({
      success: true,
      data: quiz,
    });
  }
);

// @description  getAllQuizzes
// @route        GET/api/v1/quizzes
// @access       public

export const getAllQuiz = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const allQuiz = await QuizModel.find();

    // Add a fallback when allQuiz is empty

    if (!allQuiz || allQuiz.length === 0) {
      res.status(200).json({
        success: true,
        message: "no quiz found ",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: allQuiz.length,
      data: allQuiz,
    });
  }
);
