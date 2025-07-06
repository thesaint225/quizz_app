import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { QuestionsModel } from '../models/questionsModels';
import { questionZodSchema } from '../schemas/validation/question.validation';
import { QuestionInput, QuestionOutput } from '../schemas/types/question.type';
import { ZodIssue } from 'zod';
import mongoose from 'mongoose';

// @description  create new question for quiz
// @route     POST/api/v1/questions
// @access    public

export const createQuestion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //1. INPUT VALIDATION
    // validate request body against our zodSchema
    const parseResult = questionZodSchema.safeParse(req.body);

    // if validation fails return error
    if (!parseResult.success) {
      const formattedErrors = parseResult.error.errors.map((err: ZodIssue) => ({
        //show which field failed
        field: err.path.join('.'),
        // human readable error message
        message: err.message,
        // standardized error code
        errCode: `Validation_${err.code.toUpperCase}`,
      }));
      res.status(400).json({
        success: false,
        message: 'Quiz validation failed',
        errors: formattedErrors,
      });
      return;
    }
    // 2.EXTRACT VALIDATED DATA
    // destructure from the validated data
    const { data: validatedQuestion }: { data: QuestionInput } = parseResult;

    // if validation is successfully create question

    const question = await QuestionsModel.create(validatedQuestion);

    if (!question.createdAt || !question.updatedAt) {
      throw new Error('Missing timestamps on question document');
    }

    const questionOutput: QuestionOutput = {
      _id: (question._id as mongoose.Types.ObjectId).toString(),
      text: question.text,
      options: question.options,
      correct: question.correct,
      quizRef: question.quizId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: 'Question created successfully ',
      data: questionOutput,
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
        message: 'no questions found  ',
        data: [],
      });
      return;
    }

    const questionOutputList: QuestionOutput[] = allQuestions.map((q) => {
      if (!q.createdAt || !q.updatedAt) {
        throw new Error('Missing timestamp on a question document');
      }
      return {
        _id: (q._id as mongoose.Types.ObjectId).toString(),
        text: q.text,
        options: q.options,
        correct: q.correct,
        quizRef: q.quizId.toString(),
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      count: questionOutputList.length,
      data: questionOutputList,
    });
  }
);
