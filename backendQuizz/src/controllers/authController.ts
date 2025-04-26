import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Student, studentSchemaZod } from "../models/studentsModel";
import asyncHandler from "express-async-handler";

// Number of salt rounds for passwords hashing - higher is more secure slower

/**
 * Register a new student
 * error handling and input validation
 */

export const registerStudent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // step 1 :input validation
    // validate the request body against our studentSchema
    const parseResult = studentSchemaZod.safeParse(req.body);

    // if validation fails (return errors object)
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((err) => ({
        path: err.path.join(""),
        message: err.message,
      }));
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    // 1.destructure email and password form request body
    const { data: studentData } = parseResult;
    const { email, password } = studentData;
    //2.
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide both email and password ");
    }

    // 3.Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      res.status(400);
      throw new Error("email already registered ");
    }

    // //   4. Hash the password for security
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5.create new student in database
    const newStudent = await Student.create({
      email,
      password,
    });

    // 6.return success response (201 created)
    res.status(201).json({
      success: true,
      message: "student register successfully ",
      data: {
        id: newStudent._id,
        email: newStudent.email,
      },
    });
  }
);

export const loginStudent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     *1. we received password and email form the request
     */
    const { email, password } = req.body;
    /**
     * 2.we check for both email and password
     */
    if (!email || !password) {
      res.status(400);
      throw new Error("please provide both email and password ");
    }

    // 3.Find student by email
    const student = await Student.findOne({ email });
    /**
     *4- check if student exists and password matches
     * using the same error message for both cases is a security praticise
     * (prevents attackers from knowing which one failed)
     */

    if (!student || !(await bcrypt.compare(password, student.password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // 5.return success  response with student data
    res.status(200).json({
      success: true,
      message: "login successful",
      data: {
        id: student._id,
        email: student.email,
      },
    });
  }
);
