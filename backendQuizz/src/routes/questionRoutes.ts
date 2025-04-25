import { Router } from "express";
import {
  createQuestion,
  getAllQuestions,
} from "../controllers/questionController";

const questionRouter = Router();
// @desc   Create a new question
// @route  POST/api/v1/questions
questionRouter.post("/", createQuestion);

// @desc   get all questions
// @route  GET/api/v1/questions
questionRouter.get("/", getAllQuestions);

export default questionRouter;
