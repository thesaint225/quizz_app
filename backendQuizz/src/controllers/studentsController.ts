import { NextFunction, Response, Request } from "express";
import asyncHandler from "express-async-handler";
import {
  Student,
  studentSchemaZod,
  StudentInput,
} from "../models/studentsModel";
import { parse } from "path";

// @description createStudents
// @route       POST/api/v1/students
// @access      public

export const createStudent = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const parseResult = studentSchemaZod.safeParse(req.body);

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

    const { data: validatedStudentData } = parseResult;

    // if validation validation is successfully , create Student

    const student = await Student.create(validatedStudentData);
    res.status(201).json({
      success: true,
      data: student,
    });
  }
);

// @description AllStudents
// @route       GET/api/v1/students
// @access      public

export const getStudents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = await Student.find();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  }
);
