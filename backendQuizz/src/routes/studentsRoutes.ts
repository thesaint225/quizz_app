import { Router } from "express";
import { createStudent } from "../controllers/studentsController";

const router = Router();

// @route POST  /api/v1/students
router.post("/", createStudent);

export default router;
