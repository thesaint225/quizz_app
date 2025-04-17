import { Router } from "express";
import { createStudent, getStudents } from "../controllers/studentsController";

const router = Router();

// @route POST  /api/v1/students
router.post("/", createStudent).get("/", getStudents);

export default router;
