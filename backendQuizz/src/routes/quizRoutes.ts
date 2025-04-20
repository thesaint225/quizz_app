import { Router } from "express";
import { createQuiz, getAllQuiz } from "../controllers/quizController";

const router = Router();

router.post("/", createQuiz).get("/", getAllQuiz);

export default router;
