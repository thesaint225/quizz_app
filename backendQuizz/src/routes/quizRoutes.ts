import { Router } from "express";
import { createQuiz, getAllQuiz } from "../controllers/quizController";

const QuizRouter = Router();

QuizRouter.post("/", createQuiz).get("/", getAllQuiz);

export default QuizRouter;
