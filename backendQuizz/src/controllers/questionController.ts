import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  QuestionsModel,
  questionZodSchema,
  IQuestions,
} from "../models/questionsModels";

// @description  create new question for quiz
// @route     POST/api/v1/questions
// @access    public

export const createQuestion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parseResult = questionZodSchema.safeParse(req.body);
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
    // let destructure  the parseResult.data and renaming to something more declarative
    const { data: validatedQuestion } = parseResult;

    // if validation is successfully create question

    const question = await QuestionsModel.create(validatedQuestion);
    res.status(201).json({
      success: true,
      message: "Question created successfully ",
      data: question,
    });
  }
);

// description     get all questions for the quiz
// @route          GET/api/v1/questions
// @access          public

export const getAllQuestions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allQuestions = await QuestionsModel.find();

    // please add a fallback when question is empty
    if (!allQuestions || allQuestions.length === 0) {
      res.status(200).json({
        success: true,
        message: "no questions found  ",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: allQuestions.length,
      data: allQuestions,
    });
  }
);
