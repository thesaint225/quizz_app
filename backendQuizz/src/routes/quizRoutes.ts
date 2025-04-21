import { Router } from "express";
import { createQuiz, getAllQuiz } from "../controllers/quizController";

const QuizRouter = Router();
// @desc   Create a new quiz
// @route  POST/api/v1/quizzes
QuizRouter.post("/", createQuiz);

// @desc   getting all quizzes
// @route  GET/api/v1/quizzes
QuizRouter.get("/", getAllQuiz);

export default QuizRouter;
