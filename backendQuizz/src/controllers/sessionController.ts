import { NextFunction, Request, Response } from 'express';
import { SessionModel } from '../models/sessionModel';
import asyncHandler from 'express-async-handler';
import { createSessionSchema } from '../validator/session.validator';

// Controller function to create a new function
export const createSession = asyncHandler(
  // asynchandler  wraps the function to automatically catch errors
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // 1.validation phase

    // Validate incoming request
    const parseResult = createSessionSchema.safeParse(req.body);

    // if validation fails , format and returns and errors
    if (!parseResult.success) {
      // Map Zod errors to more client friendly format
      const errors = parseResult.error.errors.map((err) => {
        return {
          // convert array path to string
          path: err.path.join('.'),
          // Human-readable error message
          message: err.message,
          // Standardized  error code
          errorCode: `Validation _${err.code.toUpperCase()}`,
        };
      });

      //   Return 400 Bad Request with error details
      res.status(400).json({
        success: false,
        message: 'Session validation failed ',
        errors,
      });
      //   Exist the function Early
      return;
    }

    // 2 Data  Preparation
    // Destructure validated data from zod result
    // The "data" property contains  the successfully parsed data
    const { data: validatedSessionData } = parseResult;

    // 3.Duplicate Check
    // Check if student already has an active session for this Quiz
    const existingSession = await SessionModel.findOne({
      // Match student ID
      studentId: validatedSessionData.studentId,
      //   Match quiz ID
      quizId: validatedSessionData.quizId,
      //   Only check active session
      status: 'in-progress',
    });

    // if duplicate found return a conflict response
    if (existingSession) {
      res.status(409).json({
        success: false,
        message: `Student already has an active session for this quiz `,
        // return ID of conflicting sessions
        conflictSession: existingSession._id,
      });

      //   Exist the function
      return;
    }
    // 4.DATA OPERATION
    // Create  new session in the database
    const session = await SessionModel.create({
      // spread all validated fields
      ...validatedSessionData,
      // Add server-generated timestamp
      startedAt: new Date(),
      // Track modification time
      lastModified: new Date(),
    });

    // 5.Prepare response data (only include necessary field)

    const responseData = {
      // MongoDB-generated ID
      _id: session._id,
      // Reference to student
      studentId: session.studentId,
      // Reference to quiz
      quizId: session.quizId,
      // Current session state
      status: session.status,
      // When session began
      startedAt: session.startedAt,
      // Optional end time
      questionCount: session.answers?.length || 0,
    };

    // return successful response

    res.status(201).json({
      success: true,
      message: 'session created successfully',
      data: responseData,
    });
  }
);
