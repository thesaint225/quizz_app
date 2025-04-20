import { Router } from "express";
import { createStudent, getStudents } from "../controllers/studentsController";

const studentsRouter = Router();

// @route POST  /api/v1/students
studentsRouter.post("/", createStudent).get("/", getStudents);

export default studentsRouter;
