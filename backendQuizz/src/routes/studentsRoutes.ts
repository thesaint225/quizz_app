import { Router } from "express";
import { createStudent, getStudents } from "../controllers/studentsController";

const studentsRouter = Router();
// @desc   Create a new student
// @route POST  /api/v1/students
studentsRouter.post("/", createStudent);
// @desc   get all students
// @route  POST/api/v1/students
studentsRouter.get("/", getStudents);

export default studentsRouter;
